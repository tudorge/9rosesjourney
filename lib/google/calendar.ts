type GoogleTokenResponse = {
  access_token?: string;
  expires_in?: number;
  token_type?: string;
  error?: string;
  error_description?: string;
};

type GoogleFreeBusyResponse = {
  calendars?: Record<
    string,
    {
      busy?: {
        start: string;
        end: string;
      }[];
      errors?: {
        domain: string;
        reason: string;
      }[];
    }
  >;
  error?: {
    code: number;
    message: string;
    status: string;
  };
};

type GoogleCalendarEventResponse = {
  id?: string;
  htmlLink?: string;
  hangoutLink?: string;
  conferenceData?: {
    entryPoints?: {
      entryPointType?: string;
      uri?: string;
      label?: string;
    }[];
  };
  error?: {
    code: number;
    message: string;
    status: string;
  };
};

const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_FREEBUSY_URL =
  "https://www.googleapis.com/calendar/v3/freeBusy";

function getRequiredEnv(name: string) {
  const value = process.env[name];

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export async function getGoogleAccessToken() {
  const clientId = getRequiredEnv("GOOGLE_CLIENT_ID");
  const clientSecret = getRequiredEnv("GOOGLE_CLIENT_SECRET");
  const refreshToken = getRequiredEnv("GOOGLE_REFRESH_TOKEN");

  const response = await fetch(GOOGLE_TOKEN_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
      grant_type: "refresh_token",
    }),
  });

  const result = (await response.json()) as GoogleTokenResponse;

  if (!response.ok || result.error || !result.access_token) {
    throw new Error(
      `Could not refresh Google access token: ${
        result.error_description || result.error || response.statusText
      }`
    );
  }

  return result.access_token;
}

export async function getCalendarBusyTimes({
  timeMin,
  timeMax,
}: {
  timeMin: string;
  timeMax: string;
}) {
  const calendarId = getRequiredEnv("GOOGLE_CALENDAR_ID");
  const accessToken = await getGoogleAccessToken();

  const response = await fetch(GOOGLE_FREEBUSY_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      timeMin,
      timeMax,
      items: [{ id: calendarId }],
    }),
  });

  const result = (await response.json()) as GoogleFreeBusyResponse;

  if (!response.ok || result.error) {
    throw new Error(
      `Could not read Google Calendar availability: ${
        result.error?.message || response.statusText
      }`
    );
  }

  const calendar = result.calendars?.[calendarId];

  if (calendar?.errors?.length) {
    throw new Error(
      `Google Calendar returned an error: ${calendar.errors
        .map((item) => item.reason)
        .join(", ")}`
    );
  }

  return calendar?.busy ?? [];
}

export async function createReadingCalendarEvent({
  requestId,
  clientName,
  clientEmail,
  readingTypeLabel,
  start,
  end,
  timeZone,
}: {
  requestId: string;
  clientName: string;
  clientEmail: string;
  readingTypeLabel: string;
  start: string;
  end: string;
  timeZone: string;
}) {
  const calendarId = getRequiredEnv("GOOGLE_CALENDAR_ID");
  const accessToken = await getGoogleAccessToken();

  const url = new URL(
    `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(
      calendarId
    )}/events`
  );

  url.searchParams.set("conferenceDataVersion", "1");
  url.searchParams.set("sendUpdates", "all");

  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      summary: `Private Astrology Reading — ${clientName}`,
      description: [
        "Private astrology reading scheduled through 9 Roses Journey.",
        "",
        `Reading type: ${readingTypeLabel}`,
        `Request ID: ${requestId}`,
      ].join("\n"),
      start: {
        dateTime: start,
        timeZone,
      },
      end: {
        dateTime: end,
        timeZone,
      },
      attendees: [
        {
          email: clientEmail,
          displayName: clientName,
        },
      ],
      conferenceData: {
        createRequest: {
          requestId: `9rj-${requestId}-${Date.now()}`,
          conferenceSolutionKey: {
            type: "hangoutsMeet",
          },
        },
      },
      reminders: {
        useDefault: true,
      },
    }),
  });

  const result = (await response.json()) as GoogleCalendarEventResponse;

  if (!response.ok || result.error || !result.id) {
    throw new Error(
      `Could not create Google Calendar event: ${
        result.error?.message || response.statusText
      }`
    );
  }

  const meetLink =
    result.hangoutLink ||
    result.conferenceData?.entryPoints?.find(
      (entryPoint) => entryPoint.entryPointType === "video"
    )?.uri ||
    null;

  return {
    id: result.id,
    htmlLink: result.htmlLink ?? null,
    meetLink,
  };
}
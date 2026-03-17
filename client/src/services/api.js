function getApiBaseUrl() {
  const rawBaseUrl = import.meta.env.VITE_API_URL || "";
  return rawBaseUrl.replace(/\/$/, "");
}

const RETRY_LIMIT = 3;
const RETRY_DELAY_MS = 4000;
const REQUEST_TIMEOUT_MS = 25000;
const WAKE_UP_MESSAGE =
  "Server is waking up, please wait 30-60 seconds and try again.";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function isRetryableError(error) {
  return error.name === "AbortError" || error.name === "TypeError";
}

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timeoutId);
  }
}

async function parseResponse(response) {
  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  const text = await response.text();
  return {
    message: text || "Unexpected server response.",
  };
}

export async function analyzeResume({
  resumeFile,
  jobDescription,
  onStatusChange,
}) {
  const apiBaseUrl = getApiBaseUrl();
  const endpoint = `${apiBaseUrl}/api/resume/analyze`;
  const formData = new FormData();
  formData.append("resume", resumeFile);
  formData.append("jobDescription", jobDescription || "");

  onStatusChange?.("Analyzing resume...");

  for (let attempt = 1; attempt <= RETRY_LIMIT; attempt += 1) {
    if (attempt > 1) {
      onStatusChange?.(
        `Starting server (first request may take up to 60 seconds)... retry ${attempt}/${RETRY_LIMIT}`,
      );
    }

    try {
      const response = await fetchWithTimeout(
        endpoint,
        {
          method: "POST",
          body: formData,
        },
        REQUEST_TIMEOUT_MS,
      );

      const data = await parseResponse(response);

      if (response.ok) {
        return data;
      }

      if (response.status >= 500 && attempt < RETRY_LIMIT) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      throw new Error(data.message || "Failed to analyze resume.");
    } catch (error) {
      if (attempt < RETRY_LIMIT && isRetryableError(error)) {
        await sleep(RETRY_DELAY_MS);
        continue;
      }

      if (isRetryableError(error)) {
        throw new Error(WAKE_UP_MESSAGE);
      }

      throw error;
    }
  }

  throw new Error(WAKE_UP_MESSAGE);
}

export async function prewarmBackend() {
  const apiBaseUrl = getApiBaseUrl();
  const healthUrl = `${apiBaseUrl}/api/health`;

  try {
    await fetchWithTimeout(healthUrl, { method: "GET" }, 10000);
  } catch {
    // Intentionally ignore; prewarm should not block UI
  }
}

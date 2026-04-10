const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

export const fetchWithRetry = async (
  url,
  options = {},
  retries = 2,
  delay = 1000
) => {
  let lastError;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, options);

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();

      if (data?.error || data?.reason) {
        throw new Error(data.reason || data.error || "API returned an error");
      }

      return data;
    } catch (error) {
      lastError = error;

      if (attempt < retries) {
        await sleep(delay * (attempt + 1)); // exponential-ish backoff
      }
    }
  }

  throw lastError || new Error("Failed to fetch data after retries");
};
const WINDOW_SECONDS = 60;
const LIMIT = 120;
const buckets = new Map();

function clientKey(request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "anonymous";
}

export function takeRateLimit(request, now = Date.now()) {
  const key = clientKey(request);
  const windowId = Math.floor(now / (WINDOW_SECONDS * 1000));
  const bucketKey = `${key}:${windowId}`;
  const used = (buckets.get(bucketKey) || 0) + 1;
  buckets.set(bucketKey, used);

  if (buckets.size > 2_000) {
    for (const storedKey of buckets.keys()) {
      if (!storedKey.endsWith(`:${windowId}`)) buckets.delete(storedKey);
    }
  }

  const remaining = Math.max(0, LIMIT - used);
  const reset = WINDOW_SECONDS - Math.floor((now / 1000) % WINDOW_SECONDS);
  return {
    allowed: used <= LIMIT,
    limit: LIMIT,
    remaining,
    reset,
    headers: {
      "RateLimit-Policy": `"public";q=${LIMIT};w=${WINDOW_SECONDS}`,
      RateLimit: `"public";r=${remaining};t=${reset}`,
      "RateLimit-Limit": String(LIMIT),
      "RateLimit-Remaining": String(remaining),
      "RateLimit-Reset": String(reset),
      "X-RateLimit-Limit": String(LIMIT),
      "X-RateLimit-Remaining": String(remaining),
      "X-RateLimit-Reset": String(reset),
    },
  };
}

export function resetRateLimitsForTest() {
  buckets.clear();
}

export function attachHeaders(response, headers) {
  for (const [name, value] of Object.entries(headers)) response.headers.set(name, value);
  return response;
}

export function jsonResponse(value, { status = 200, headers = {} } = {}) {
  return new Response(JSON.stringify(value), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...headers,
    },
  });
}

export function problemResponse({
  status,
  code,
  title,
  detail,
  instance,
  resolution,
  headers = {},
}) {
  return new Response(
    JSON.stringify({
      type: `https://www.helioxos.dev/developers#problem-${code}`,
      title,
      status,
      detail,
      instance,
      code,
      resolution,
    }),
    {
      status,
      headers: {
        "content-type": "application/problem+json; charset=utf-8",
        "cache-control": "no-store",
        ...headers,
      },
    },
  );
}

export const PUBLIC_RATE_LIMIT = { limit: LIMIT, window_seconds: WINDOW_SECONDS };

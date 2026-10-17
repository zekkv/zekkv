import { createServerFn, createServerOnlyFn } from "@tanstack/react-start";
import { env } from "@/env";
import { redis } from "@/lib/redis.server";

// Manual types — replace by running:
//   bunx @strapi/client generate-types --url $STRAPI_URL --token $STRAPI_API_TOKEN

export interface StrapiProject {
  id: number;
  documentId: string;
  title: string;
  role: string;
  duration: string;
  summary?: string | null;
  description: string[];
  techStack: string[];
  githubLink?: string | null;
  liveLink?: string | null;
  category?: string | null;
}

export interface StrapiExperience {
  id: number;
  documentId: string;
  company: string;
  role: string;
  location: string;
  duration: string;
  bullets?: string[] | null;
}

export interface StrapiEducation {
  id: number;
  documentId: string;
  school: string;
  degree: string;
  track?: string | null;
  duration: string;
}
// rAyuaV5qvxtes7Ev
export interface StrapiUserProfile {
  id: number;
  documentId: string;
  name: string;
  initials: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  now: string;
  last: string;
}

export interface StrapiToolkit {
  id: number;
  documentId: string;
  languages: string[];
  cloud: string[];
  frameworks: string[];
}

// Everything lives under one Redis key (hash fields per content type) so a
// single publish anywhere invalidates the whole cache with one `del`.
const CACHE_KEY = "strapi-cache";

// The CMS scales to zero (Cloud Run, min-instances=0). A cold start queues the
// first request for ~15s and answers concurrent arrivals with 429 while the
// single instance boots, so retrying is required — but the *total* wait must
// stay far below the edge's request limits, or a visitor gets nothing at all
// instead of a slow page. The budget below bounds the whole call, all attempts
// included; the first attempt is generous enough to cover a cold queue.
const TOTAL_BUDGET_MS = 30_000;
const ATTEMPT_TIMEOUT_MS = 20_000;
const RETRY_DELAY_MS = 2_000;

// Upstash calls are fast, but an unbounded one would hang the render just as
// badly as an unbounded CMS fetch.
const REDIS_TIMEOUT_MS = 5_000;

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function withTimeout<T>(
  work: Promise<T>,
  ms: number,
  what: string
): Promise<T> {
  return Promise.race([
    work,
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error(`${what} timed out after ${ms}ms`)), ms)
    ),
  ]);
}

async function fetchFromStrapi<T>(path: string): Promise<T> {
  const deadline = Date.now() + TOTAL_BUDGET_MS;
  let lastError: unknown;

  for (let attempt = 0; ; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining <= 1_000) break;
    if (attempt > 0) await sleep(Math.min(RETRY_DELAY_MS, remaining));

    let res: Response;
    try {
      res = await fetch(`${env.STRAPI_URL}/api/${path}`, {
        headers: {
          Authorization: `Bearer ${env.STRAPI_API_TOKEN}`,
        },
        signal: AbortSignal.timeout(
          Math.min(ATTEMPT_TIMEOUT_MS, Math.max(1_000, deadline - Date.now()))
        ),
      });
    } catch (error) {
      // network error or timeout — worth another attempt inside the budget
      lastError = error;
      continue;
    }

    if (!res.ok) {
      const message = `Strapi fetch failed: ${path} — ${res.status} ${res.statusText}`;
      // 429 (no instance available during a cold start) and 5xx (instance
      // restarting) are transient; any other status is permanent.
      if (res.status === 429 || res.status >= 500) {
        lastError = new Error(message);
        continue;
      }
      throw new Error(message);
    }

    return (await res.json()) as T;
  }

  throw (
    lastError ??
    new Error(
      `Strapi fetch failed: ${path} — ${TOTAL_BUDGET_MS}ms budget exhausted`
    )
  );
}

async function get<T>(path: string): Promise<T> {
  const field = path.split("?")[0];
  const cached = await withTimeout(
    redis.hget<T>(CACHE_KEY, field),
    REDIS_TIMEOUT_MS,
    "redis.hget"
  );
  if (cached !== null && cached !== undefined) {
    return cached;
  }

  const data = await fetchFromStrapi<T>(path);
  await withTimeout(
    redis.hset(CACHE_KEY, { [field]: data }),
    REDIS_TIMEOUT_MS,
    "redis.hset"
  );
  return data;
}

export const invalidateStrapiCache = createServerOnlyFn(async () => {
  await redis.del(CACHE_KEY);
});

export const fetchProjects = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiProject[] }>(
      "projects?sort=publishedAt:desc&pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 projects — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchExperiences = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiExperience[] }>(
      "experiences?pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 experiences — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchEducation = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiEducation[] }>(
      "educations?sort=publishedAt:asc&pagination[limit]=100"
    );
    if (data.length === 0) {
      throw new Error(
        "Strapi returned 0 education entries — check Strapi connection and published content"
      );
    }
    return data;
  }
);

export const fetchUserProfile = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiUserProfile | null }>(
      "user-profile"
    );
    if (!data) {
      throw new Error(
        "Strapi UserProfile not configured — add data in Strapi admin"
      );
    }
    return data;
  }
);

export const fetchToolkit = createServerFn({ method: "GET" }).handler(
  async () => {
    const { data } = await get<{ data: StrapiToolkit | null }>("toolkit");
    if (!data) {
      throw new Error(
        "Strapi Toolkit not configured — add data in Strapi admin"
      );
    }
    return data;
  }
);

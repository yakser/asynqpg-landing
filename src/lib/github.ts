const REPO_OWNER = "yakser";
const REPO_NAME = "asynqpg";
const API_BASE = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}`;

export interface RepoMeta {
  stars: number;
  starsFormatted: string;
  forks: number;
  openIssues: number;
  latestVersion: string | null;
  license: string | null;
  htmlUrl: string;
  description: string | null;
}

const FALLBACK: RepoMeta = {
  stars: 0,
  starsFormatted: "0",
  forks: 0,
  openIssues: 0,
  latestVersion: null,
  license: null,
  htmlUrl: `https://github.com/${REPO_OWNER}/${REPO_NAME}`,
  description: null,
};

function formatStars(n: number): string {
  if (n < 1000) return String(n);
  if (n < 10_000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  if (n < 1_000_000) return Math.round(n / 1000) + "k";
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
}

function authHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "User-Agent": "asynqpg-landing-build",
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
  };
  const token = process.env.GITHUB_TOKEN;
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

let cached: Promise<RepoMeta> | null = null;

export function fetchRepoMeta(): Promise<RepoMeta> {
  if (cached) return cached;
  cached = (async () => {
    try {
      const headers = authHeaders();
      const [repoRes, releaseRes, tagsRes] = await Promise.all([
        fetch(API_BASE, { headers }),
        fetch(`${API_BASE}/releases/latest`, { headers }),
        fetch(`${API_BASE}/tags?per_page=1`, { headers }),
      ]);

      if (!repoRes.ok) {
        throw new Error(`GitHub API ${repoRes.status} for repo`);
      }
      const repo = (await repoRes.json()) as {
        stargazers_count: number;
        forks_count: number;
        open_issues_count: number;
        html_url: string;
        description: string | null;
        license: { spdx_id: string | null } | null;
      };

      let latestVersion: string | null = null;
      if (releaseRes.ok) {
        const release = (await releaseRes.json()) as { tag_name?: string };
        latestVersion = release.tag_name ?? null;
      }
      if (!latestVersion && tagsRes.ok) {
        const tags = (await tagsRes.json()) as Array<{ name: string }>;
        latestVersion = tags[0]?.name ?? null;
      }

      return {
        stars: repo.stargazers_count,
        starsFormatted: formatStars(repo.stargazers_count),
        forks: repo.forks_count,
        openIssues: repo.open_issues_count,
        latestVersion,
        license: repo.license?.spdx_id ?? null,
        htmlUrl: repo.html_url,
        description: repo.description,
      };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.warn(`[github] falling back: ${msg}`);
      return FALLBACK;
    }
  })();
  return cached;
}

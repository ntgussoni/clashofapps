interface GitHubRepoStats {
  stargazers_count: number;
  forks_count: number;
}

/**
 * Fetches GitHub repository statistics without requiring authentication
 * Uses GitHub's public API with rate limiting and caching
 */
export async function getGitHubStats(
  owner: string,
  repo: string,
): Promise<GitHubRepoStats | null> {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${owner}/${repo}`,
      {
        headers: {
          Accept: "application/vnd.github.v3+json",
        },
        // Add cache for 1 hour to avoid hitting GitHub's rate limits
        next: {
          revalidate: 3600,
        },
      },
    );

    if (!response.ok) {
      console.error("Failed to fetch GitHub stats:", response.statusText);
      return null;
    }

    const data = (await response.json()) as GitHubRepoStats;
    return {
      stargazers_count: data.stargazers_count,
      forks_count: data.forks_count,
    };
  } catch (error) {
    console.error("Error fetching GitHub stats:", error);
    return null;
  }
}

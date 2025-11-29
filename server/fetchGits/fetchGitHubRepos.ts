async function fetchGitHubRepos(
  username: string,
  token: string,
  userAgent: string,
): Promise<Repository[]> {
  const headers = {
    'Authorization': `token ${token}`,
    'User-Agent': userAgent,
    'Accept': 'application/vnd.github+json',
  }

  const repoResponse = await $fetch<GitHubRepoRaw[]>(
    `https://api.github.com/users/${username}/repos`,
    { headers, method: 'GET' },
  )

  const repositories: Repository[] = []

  for (const repo of repoResponse) {
    const [commitsData, languagesData] = await Promise.all([
      $fetch<GitHubCommitRaw[]>(
        `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`,
        { headers },
      ),
      $fetch<Record<string, number>>(
        `https://api.github.com/repos/${username}/${repo.name}/languages`,
        { headers },
      ),
    ])

    const lastFivecommitsList: RepositoryCommit[] = commitsData.map(({ sha, commit }) => ({
      id: sha,
      date: commit.author.date,
      message: commit.message,
    }))

    repositories.push(
      {
        name: repo.name,
        lastFivecommitsList,
        image: `https://raw.githubusercontent.com/${username}/${repo.name}/main/images/1.png`,
        languages: Object.keys(languagesData),
        url: repo.html_url,
        provider: 'GitHub',
      },
    )
  }
  return repositories
}

export { fetchGitHubRepos }

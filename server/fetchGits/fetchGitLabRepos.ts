async function fetchGitLabRepos(
  username: string,
  token: string,
  userAgent: string,
): Promise<Repository[]> {
  const headers = {
    'Private-Token': token,
    'User-Agent': userAgent,
    'Accept': 'application/json',
  }

  const projectResponse = await $fetch<GitLabProjectRaw[]>(
    `https://gitlab.com/api/v4/users/${username}/projects?per_page=100&visibility=public`,
    { headers, method: 'GET' },
  )

  const repositories: Repository[] = []

  for (const project of projectResponse) {
    const projectId = project.id

    const [commitsData, languagesData] = await Promise.all([
      $fetch<GitLabCommitRaw[]>(
        `https://gitlab.com/api/v4/projects/${projectId}/repository/commits?per_page=5`,
        { headers },
      ),
      $fetch<Record<string, number>>(
        `https://gitlab.com/api/v4/projects/${projectId}/languages`,
        { headers },
      ),
    ])

    const lastFivecommitsList = commitsData.map(commit => ({
      date: commit.created_at,
      message: commit.message,
    }))

    const image = project.avatar_url ?? 'default_gitlab_image.png'

    repositories.push(
      {
        name: project.name,
        lastFivecommitsList,
        image,
        languages: Object.keys(languagesData),
        url: project.web_url,
        provider: 'GitLab',
      },
    )
  }

  return repositories
}

export { fetchGitLabRepos }

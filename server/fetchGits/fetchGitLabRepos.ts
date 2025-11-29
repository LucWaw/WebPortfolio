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

  const projectResponsePromise = $fetch<GitLabProjectRaw[]>(
    `https://gitlab.com/api/v4/users/${username}/projects?per_page=100&visibility=public`,
    { headers, method: 'GET' },
  )

  const projects = await projectResponsePromise

  const tasks: Promise<Repository>[] = []

  for (const project of projects) {
    const projectId = project.id

    const task = (async () => {
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

      const lastFivecommitsList: RepositoryCommit[] = commitsData.map(commit => ({
        id: commit.id,
        date: commit.created_at,
        message: commit.message,
      }))

      return {
        name: project.name,
        lastFivecommitsList,
        image: project.avatar_url ?? 'default_gitlab_image.png',
        languages: Object.keys(languagesData),
        url: project.web_url,
        provider: 'GitLab',
      } as Repository
    })()

    tasks.push(task)
  }

  return Promise.all(tasks)
}

export { fetchGitLabRepos }

import { fetchGitHubRepos } from '../fetchGits/fetchGitHubRepos'

async function fetchRepos(
  githubUsername: string,
  tokenGithub: string,
): Promise<Repository[]> {
  const [githubRepos] = await Promise.all([
    fetchGitHubRepos(githubUsername, tokenGithub, githubUsername),
  ])

  return [...githubRepos]
}

export default defineCachedEventHandler(
  async () => {
    const tokenGithub = useRuntimeConfig().githubToken
    const {
      public: { githubUser },
    } = useRuntimeConfig()

    const repos = await fetchRepos(githubUser, tokenGithub)

    return {
      data: repos,
    }
  },
  {
    maxAge: 60 * 60,
    swr: false,
    name: 'github-repos',
    getKey: () => 'github-repos',
  },
)

import { fetchGitLabRepos } from '../fetchGits/fetchGitLabRepos'

async function fetchRepos(
  gitlabUsername: string,
  tokenGitlab: string,
): Promise<Repository[]> {
  const [gitlabRepos] = await Promise.all([
    fetchGitLabRepos(gitlabUsername, tokenGitlab, gitlabUsername),
  ])

  return [...gitlabRepos]
}

export default defineCachedEventHandler(
  async () => {
    const tokenGitlab = useRuntimeConfig().gitlabToken
    const {
      public: { gitlabUser },
    } = useRuntimeConfig()

    const repos = await fetchRepos(gitlabUser, tokenGitlab)

    return {
      data: repos,
    }
  },
  {
    maxAge: 60 * 0.5,
    swr: false,
    name: 'gitlab-repos',
    getKey: () => 'gitlab-repos',
  },
)

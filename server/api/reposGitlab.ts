import { fetchGitLabRepos } from "../fetchGits/fetchGitLabRepos";

async function fetchRepos(
    gitlabUsername: string,
    tokenGitlab: string
): Promise<Repository[]> {
    const [gitlabRepos] = await Promise.all([
        fetchGitLabRepos(gitlabUsername, tokenGitlab, gitlabUsername),
    ]);

    return [...gitlabRepos];
}

export default defineCachedEventHandler(
    async (event) => {
        const tokenGitLab = useRuntimeConfig().gitlabToken;
        const {
            public: { githubUser },
        } = useRuntimeConfig();

        const repos = await fetchRepos(githubUser, tokenGitLab);
        shuffleArray(repos);

        return {
            success: true,
            data: {
                platformName: Platform.GitLab,
                repos: repos,
            },
            message: `${repos.length} Repositories retrieved successfully`,
        };
    },
    {
        maxAge: 60 * 1, // 2 minutes
        swr: false,
        name: "git-lab-repos",
        getKey: () => "all-git-lab-repos",
    }
);

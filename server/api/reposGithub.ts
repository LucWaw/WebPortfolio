import { fetchGitHubRepos } from "../fetchGits/fetchGitHubRepos";

async function fetchRepos(
    githubUsername: string,
    tokenGithub: string
): Promise<Repository[]> {
    const [githubRepos] = await Promise.all([
        fetchGitHubRepos(githubUsername, tokenGithub, githubUsername),
    ]);

    return [...githubRepos];
}

export default defineCachedEventHandler(
    async (event): Promise<ApiResponse<Repository[]>> => {
        const tokenGithub = useRuntimeConfig().githubToken;
        const {
            public: { githubUser },
        } = useRuntimeConfig();

        const repos = await fetchRepos(githubUser, tokenGithub);
        shuffleArray(repos);

        return {
            success: true,
            data: repos,
            message: `${repos.length} Repositories retrieved successfully`,
        };
    },
    {
        maxAge: 60 * 1, // 1 minutes
        swr: false,
        name: "git-hub-repos",
        getKey: () => "all-git-hub-repos",
    }
);

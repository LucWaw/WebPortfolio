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
    async (event): Promise<ApiResponse<Repository[]>> => {
        const tokenGitlab = useRuntimeConfig().gitlabToken;
        const {
            public: { gitlabUser },
        } = useRuntimeConfig();

        const repos = await fetchRepos(gitlabUser, tokenGitlab);
        shuffleArray(repos);

        return {
            success: true,
            data: repos,
            message: `${repos.length} GitLab Repositories retrieved successfully`,
        };
    },
    {
        maxAge: 60 * 1, // 1 minutes
        swr: false,
        name: "gitlab-repos",
        getKey: () => "gitlab-repos",
    }
);

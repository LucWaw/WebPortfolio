import { fetchGitHubRepos } from "../fetchGits/fetchGitHubRepos";
import { fetchGitLabRepos } from "../fetchGits/fetchGitLabRepos";

async function fetchAllRepos(
    githubUsername: string,
    tokenGithub: string,
    gitlabUsername: string,
    tokenGitlab: string
): Promise<Repository[]> {
    const [githubRepos, gitlabRepos] = await Promise.all([
        fetchGitHubRepos(githubUsername, tokenGithub, githubUsername),
        fetchGitLabRepos(gitlabUsername, tokenGitlab, gitlabUsername),
    ]);
    return [...githubRepos, ...gitlabRepos];
}

export default defineCachedEventHandler(
    async (event): Promise<ApiResponse<Repository[]>> => {
        const {
            public: { githubUser, gitlabUser },
        } = useRuntimeConfig();
        const tokenGithub = useRuntimeConfig().githubToken;
        const tokenGitlab = useRuntimeConfig().gitlabToken;

        const repos = await fetchAllRepos(
            githubUser,
            tokenGithub,
            gitlabUser,
            tokenGitlab
        );
        shuffleArray(repos);

        return {
            success: true,
            data: repos,
            message: `${repos.length} Repositories retrieved (GitHub + GitLab)`,
        };
    },
    {
        maxAge: 60 * 1,
        swr: false,
        name: "all-repos",
        getKey: () => "all-repos",
    }
);

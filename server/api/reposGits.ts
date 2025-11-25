// server/middleware/github-token.ts
// server/api/github/repos.get.ts
// server/api/github/repos.get.ts

// server/api/github/repos.get.ts

import { fetchGitHubRepos } from "../fetchGits/fetchGitHubRepos";
import { fetchGitLabRepos } from "../fetchGits/fetchGitLabRepos";

async function fetchAllRepos(
    githubUsername: string,
    gitlabUsername: string,
    tokenGithub: string,
    tokenGitLab: string
): Promise<Repository[]> {
    const [githubRepos, gitlabRepos] = await Promise.all([
        fetchGitHubRepos(githubUsername, tokenGithub, githubUsername),
        fetchGitLabRepos(gitlabUsername, tokenGitLab, githubUsername),
    ]);
    console.log("repos loaded");

    return [...githubRepos, ...gitlabRepos];
}

function shuffleArray(array: any[]) {
    console.log("shuffling array");
    for (let i = array.length - 1; i > 0; i--) {
        console.log("shuffling index:", i);
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default defineCachedEventHandler(
    async (event) => {
        /*throw createError({
            
        });*/
        const tokenGithub = useRuntimeConfig().githubToken;
        const {
            public: { githubUser },
        } = useRuntimeConfig();
        const tokenGitLab = useRuntimeConfig().gitlabToken;
        const {
            public: { gitlabUser },
        } = useRuntimeConfig();

        const repos = await fetchAllRepos(
            githubUser,
            gitlabUser,
            tokenGithub,
            tokenGitLab
        );
        shuffleArray(repos);
        return repos;
    },
    {
        maxAge: 60 * 60, // 1 hour
        swr: false,
        name: "git-repos",
        getKey: () => "all-git-repos",
    }
);

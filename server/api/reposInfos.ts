// server/middleware/github-token.ts
// server/api/github/repos.get.ts
// server/api/github/repos.get.ts

// server/api/github/repos.get.ts

import { fetchGitHubRepos } from "./fetchGitHubRepos";
import { fetchGitLabRepos } from "./fetchGitLabRepos";
import { Repository } from "./Repo";

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
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
}

export default defineEventHandler(async (event) => {
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
    return repos;
});

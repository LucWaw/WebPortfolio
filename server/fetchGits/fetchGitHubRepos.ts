interface GitHubRepoRaw {
    name: string;
    html_url: string;
    [key: string]: any;
}

interface GitHubCommitRaw {
    commit: {
        author: { date: string };
        message: string;
    };
    [key: string]: any;
}

async function fetchGitHubRepos(
    username: string,
    token: string,
    userAgent: string
): Promise<Repository[]> {
    const headers = {
        Authorization: `token ${token}`,
        "User-Agent": userAgent,
        Accept: "application/vnd.github+json",
    };

    const repoResponse = await $fetch<GitHubRepoRaw[]>(
        `https://api.github.com/users/${username}/repos`,
        { headers, method: "GET" }
    );

    const repositories: Repository[] = [];

    for (const repo of repoResponse) {
        const [commitsData, languagesData] = await Promise.all([
            $fetch<GitHubCommitRaw[]>(
                `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`,
                { headers }
            ),
            $fetch<Record<string, any>>(
                `https://api.github.com/repos/${username}/${repo.name}/languages`,
                { headers }
            ),
        ]);

        const lastFivecommitsList = commitsData.map(({ commit }) => ({
            date: commit.author.date,
            message: commit.message,
        }));

        repositories.push(
            new Repository(
                repo.name,
                lastFivecommitsList,
                `https://raw.githubusercontent.com/${username}/${repo.name}/main/images/1.png`,
                Object.keys(languagesData),
                repo.html_url,
                true
            )
        );
    }

    return repositories;
}

export { fetchGitHubRepos };

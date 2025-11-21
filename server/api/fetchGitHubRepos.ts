import { Repository } from "./Repo";

async function fetchGitHubRepos(username: string, token: string, userAgent: string): Promise<Repository[]> {
    const headers: Record<string, string> = {
        Authorization: `token ${token}`,
        "User-Agent": userAgent,
        Accept: "application/vnd.github+json",
    };

    let repoResponse: Response;
    try {
        repoResponse = await fetch(
            `https://api.github.com/users/${username}/repos`,
            { headers }
        );
    } catch (err) {
        console.error("Network error while fetching repos:", err);
        return [];
    }

    if (!repoResponse.ok) {
        if (repoResponse.status === 403) {
            console.warn("403 Forbidden – rate limit or quota exceeded");
            return [];
        }
        console.error(
            "Error response:",
            repoResponse.status,
            repoResponse.statusText
        );
        return [];
    }

    let reposData: any[];
    try {
        reposData = await repoResponse.json();
    } catch (err) {
        console.error("Failed to parse repos JSON:", err);
        return [];
    }

    const repositories: Repository[] = [];

    for (const repo of reposData) {
        const commitsUrl = `https://api.github.com/repos/${username}/${repo.name}/commits?per_page=5`;
        const languagesUrl = `https://api.github.com/repos/${username}/${repo.name}/languages`;

        let commitsResponse: Response | null = null;
        let languagesResponse: Response | null = null;

        try {
            [commitsResponse, languagesResponse] = await Promise.all([
                fetch(commitsUrl, { headers }),
                fetch(languagesUrl, { headers }),
            ]);
        } catch (err) {
            console.error(`Network error for repo ${repo.name}:`, err);
            repositories.push(
                new Repository(
                    repo.name,
                    [],
                    `https://raw.githubusercontent.com/${username}/${repo.name}/main/images/1.png`,
                    []
                )
            );
            continue;
        }

        if (commitsResponse && commitsResponse.status === 403) {
            console.warn(`403 on commits for ${repo.name} — skipping commits`);
        }
        if (languagesResponse && languagesResponse.status === 403) {
            console.warn(
                `403 on languages for ${repo.name} — skipping languages`
            );
        }

        let commitsData: any[] = [];
        if (commitsResponse && commitsResponse.ok) {
            try {
                commitsData = await commitsResponse.json();
            } catch (err) {
                console.error(
                    `Failed to parse commits JSON for ${repo.name}:`,
                    err
                );
                commitsData = [];
            }
        }

        let languagesData: Record<string, any> = {};
        if (languagesResponse && languagesResponse.ok) {
            try {
                languagesData = await languagesResponse.json();
            } catch (err) {
                console.error(
                    `Failed to parse languages JSON for ${repo.name}:`,
                    err
                );
                languagesData = {};
            }
        }

        const lastFivecommitsList = Array.isArray(commitsData)
            ? commitsData.slice(0, 5).map((commit: any) => {
                  const date = commit?.commit?.author?.date ?? "";
                  const message = commit?.commit?.message ?? "";
                  return { date, message };
              })
            : [];

        const languages = Array.isArray(Object.keys(languagesData))
            ? Object.keys(languagesData)
            : [];

        const image = `https://raw.githubusercontent.com/${username}/${repo.name}/main/images/1.png`;

        repositories.push(
            new Repository(repo.name, lastFivecommitsList, image, languages)
        );
    }

    return repositories;
}


export { fetchGitHubRepos };
import { Repository } from "./Repo";

async function fetchGitLabRepos(
    username: string,
    token: string,
    userAgent: string
): Promise<Repository[]> {
    const headers: Record<string, string> = {
        "PRIVATE-TOKEN": token,
        "User-Agent": userAgent,
        Accept: "application/json",
        crossOriginResourcePolicy: "false",
    };

    let projectsResponse: Response;
    try {
        projectsResponse = await fetch(
            `https://gitlab.com/api/v4/users/${username}/projects?per_page=100&visibility=public`,
            { headers }
        );
    } catch (err) {
        console.error("Network error while fetching GitLab projects:", err);
        return [];
    }

    console.log(projectsResponse.headers);

    if (!projectsResponse.ok) {
        if (projectsResponse.status === 403) {
            console.warn(
                "403 Forbidden – rate limit or insufficient permission"
            );
            return [];
        }
        console.error(
            "Error response:",
            projectsResponse.status,
            projectsResponse.statusText
        );
        return [];
    }

    let projectsData: any[];
    try {
        projectsData = await projectsResponse.json();
    } catch (err) {
        console.error("Failed to parse GitLab projects JSON:", err);
        return [];
    }

    const repositories: Repository[] = [];

    for (const project of projectsData) {
        const projectId = project.id;
        const commitsUrl = `https://gitlab.com/api/v4/projects/${projectId}/repository/commits?per_page=5`;
        const languagesUrl = `https://gitlab.com/api/v4/projects/${projectId}/languages`;

        let commitsResponse: Response | null = null;
        let languagesResponse: Response | null = null;

        try {
            [commitsResponse, languagesResponse] = await Promise.all([
                fetch(commitsUrl, { headers }),
                fetch(languagesUrl, { headers }),
            ]);
        } catch (err) {
            console.error(`Network error for project ${project.name}:`, err);
            repositories.push(
                new Repository(project.name, [], project.avatar_url || "", [])
            );
            continue;
        }

        if (commitsResponse && commitsResponse.status === 403) {
            console.warn(
                `403 on commits for ${project.name} — skipping commits`
            );
        }
        if (languagesResponse && languagesResponse.status === 403) {
            console.warn(
                `403 on languages for ${project.name} — skipping languages`
            );
        }

        let commitsData: any[] = [];
        if (commitsResponse && commitsResponse.ok) {
            try {
                commitsData = await commitsResponse.json();
            } catch (err) {
                console.error(
                    `Failed to parse commits JSON for ${project.name}:`,
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
                    `Failed to parse languages JSON for ${project.name}:`,
                    err
                );
                languagesData = {};
            }
        }

        const lastFivecommitsList = Array.isArray(commitsData)
            ? commitsData.slice(0, 5).map((commit: any) => {
                  const date = commit?.created_at ?? "";
                  const message = commit?.title ?? "";
                  return { date, message };
              })
            : [];

        const languages = Array.isArray(Object.keys(languagesData))
            ? Object.keys(languagesData)
            : [];

        const image = project.avatar_url || `noPhotoGitLab.png`;

        repositories.push(
            new Repository(project.name, lastFivecommitsList, image, languages)
        );
    }

    return repositories;
}

export { fetchGitLabRepos };

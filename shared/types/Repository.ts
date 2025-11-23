// A simple class to represent a Git repository with its name, commit history, and an associated image.
export class Repository {
    readonly name: string;
    readonly lastFivecommitsList: Array<{ date: string; message: string }>;
    readonly image: string;
    readonly languages: Array<string>;
    readonly url: string;
    readonly isGitHub: boolean; // true if GitHub, false if GitLab, undefined if not specified

    constructor(
        name: string,
        lastFivecommitsList: Array<{ date: string; message: string }> = [],
        image: string,
        languages: Array<string> = [],
        url: string,
        isGitHub: boolean
    ) {
        this.name = name;
        this.lastFivecommitsList = lastFivecommitsList;
        this.image = image;
        this.languages = languages;
        this.url = url;
        this.isGitHub = isGitHub;
    }
}

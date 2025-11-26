// A simple class to represent a Git repository with its name, commit history, and an associated image.
export class Repository {
    readonly name: string;
    readonly lastFivecommitsList: Array<{ date: string; message: string }>;
    readonly image: string;
    readonly languages: Array<string>;
    readonly url: string;
    readonly isGitHub;

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

export interface ApiResponse<T> {
    success: boolean;
    data: T;
    message?: string;
}

// Interface représentant un objet du tableau renvoyé par l'API GitHub
export interface GitHubRepoRaw {
    id: number;
    name: string;
    html_url: string; // Utile pour votre propriété 'url'
    // Cette ligne permet d'accepter toutes les autres propriétés (owner, fork, etc.)
    // sans avoir à les déclarer, évitant les erreurs de type.
    [key: string]: any;
}

export interface GitHubCommitRaw {
    commit: {
        author: { date: string };
        message: string;
    };
    [key: string]: any;
}

export interface GitLabProjectRaw {
    id: number;
    name: string;
    web_url: string;
    avatar_url: string | null;
    [key: string]: any;
}

export interface GitLabCommitRaw {
    id: string;
    short_id: string;
    created_at: string;
    message: string;
    author_name: string;
    [key: string]: any;
}

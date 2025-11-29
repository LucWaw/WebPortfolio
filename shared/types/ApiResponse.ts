// A simple interface to represent a Git repository with its name, commit history, and an associated image.
export interface Repository {
  name: string
  lastFivecommitsList: Array<{ id: string, date: string, message: string }>
  image: string
  languages: Array<string>
  url: string
  provider: 'GitHub' | 'GitLab'
}

export interface GitHubRepoRaw {
  id: number
  name: string
  html_url: string
  // The image is taken from always same url in repo :
  // https://raw.githubusercontent.com/${username}/${repo.name}/main/images/1.png
}

export interface GitHubCommitRaw {
  sha: string
  commit: {
    sha: string
    author: { date: string }
    message: string
  }
}

export interface GitLabProjectRaw {
  id: number
  name: string
  web_url: string
  avatar_url: string | null // The image is taken from project avatar
}

export interface GitLabCommitRaw {
  id: string
  created_at: string
  message: string
}

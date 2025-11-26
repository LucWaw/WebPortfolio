// A simple interface to represent a Git repository with its name, commit history, and an associated image.
export interface Repository {
  name: string
  lastFivecommitsList: Array<{ date: string, message: string }>
  image: string
  languages: Array<string>
  url: string
  provider: 'GitHub' | 'GitLab'
}

export interface GitHubRepoRaw {
  id: number
  name: string
  html_url: string
  [key: string]: any
}

export interface GitHubCommitRaw {
  commit: {
    author: { date: string }
    message: string
  }
  [key: string]: any
}

export interface GitLabProjectRaw {
  id: number
  name: string
  web_url: string
  avatar_url: string | null
  [key: string]: any
}

export interface GitLabCommitRaw {
  id: string
  short_id: string
  created_at: string
  message: string
  author_name: string
  [key: string]: any
}

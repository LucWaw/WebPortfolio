// A simple class to represent a Git repository with its name, commit history, and an associated image.
class Repository {
  readonly name: string;
  readonly lastFivecommitsList: Array<{ date: string; message: string }>;
  readonly image: string;
  readonly languages: Array<string>;

  constructor(name: string, lastFivecommitsList: Array<{ date: string; message: string }> = [], image: string, languages: Array<string> = []) {
    this.name = name;
    this.lastFivecommitsList = lastFivecommitsList;
    this.image = image;
    this.languages = languages;
  }
}


export { Repository };
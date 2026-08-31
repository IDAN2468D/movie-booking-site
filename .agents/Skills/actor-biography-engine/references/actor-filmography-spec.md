# Actor Filmography Specification

## Data Model
- `id`: number (TMDB Person ID)
- `name`: string
- `biography`: string
- `profilePath`: string (URL)
- `knownForDepartment`: string
- `birthday`: string
- `placeOfBirth`: string
- `movieCredits`: Array<{ id: number, title: string, releaseDate: string, character: string, posterPath: string }>

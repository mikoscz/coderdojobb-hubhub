//   title: string;
//   durationInSeconds: number;
//   description: string;
//   yearOfRelease: number;
//   addedAt: Date;

const movies = [
  {
    id: "c9f0c745-0465-4bd1-bf0e-04722533901b",
    title: "Movie 1",
    durationInSeconds: 62 * 60,
    description: "Fancy moviee #1",
    yearOfRelease: 2024,
    addedAt: "2024-04-24T15:28:24.970Z",
  },
  {
    id: "623bba3a-b0f1-492f-bd27-37b767984afa",
    title: "Movie 2",
    durationInSeconds: 22 * 60,
    description: "Fancy moviee #2",
    yearOfRelease: 2022,
    addedAt: "2024-04-24T15:28:24.970Z",
  },
];

export class MoviesService {
  getAllMovies() {
    return movies;
  }
}

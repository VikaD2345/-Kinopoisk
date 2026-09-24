import express from "express";
import moviesRouter from "./routes/moviesRouter.js";
import genresRouter from "./routes/genresRouter.js";
import movieGenresRouter from "./routes/movieGenresRouter.js";
import reviewsRouter from "./routes/reviewsRouter.js";
import usersRouter from "./routes/usersRouter.js";
import seriesRouter from "./routes/seriesRouter.js";
import { checkDatabaseConnection } from "./database/db.js";
import { authenticate } from "./middleware/auth.js";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(authenticate);

app.use("/movies", moviesRouter);
app.use("/genres", genresRouter);
app.use("/movie_genres", movieGenresRouter);
app.use("/reviews", reviewsRouter);
app.use("/users", usersRouter);
app.use("/series", seriesRouter);

try {
  await checkDatabaseConnection();
  console.log("PostgreSQL connected");

  app.listen(port, () => {
    console.log(`Server started on http://localhost:${port}`);
  });
} catch (error) {
  console.error("Failed to connect to PostgreSQL:", error.message);
  process.exit(1);
}

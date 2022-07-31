const express = require("express");
const path = require("path");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");

const dbPath = path.join(__dirname, "moviesData.db");

const app = express();

app.use(express.json());

let db = null;

const startServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server run");
    });
  } catch (e) {
    console.log(`error ${e}`);
    process.exit(1);
  }
};

startServer();

app.get("/movies/", async (request, response) => {
  const movieQuery = `
    SELECT movie_name FROM movie `;
  const movie = await db.all(movieQuery);
  response.send(movie);
});
//add
app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const addQuery = `
  INSERT INTO movie (director_id,movie_name,lead_actor)
  VALUES('${directorId}','${movieName}','${leadActor}')
  `;
  const add = await db.run(addQuery);
  response.send("Movie Successfully Added");
});

//get
app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getQuery = `
  SELECT * 
  FROM 
  movie 
  WHERE 
  movie_id=${movieId}`;
  const mov = await db.all(getQuery);
  response.send(mov);
});

//put
app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const upQuery = `
  UPDATE movie 
  SET 
  director_id = '${directorId}',
  movie_name = '${movieName}',
  lead_actor = '${leadActor}'
  WHERE movie_id= '${movieId}'`;
  await db.run(upQuery);
  response.send("Movie Details Updated");
});

app.delete("/movies/:movieId", async (request, response) => {
  const { movieId } = request.params;
  const deleteQuery = `
    DELETE FROM movie WHERE movie_id = '${movieId}'`;
  await db.run(deleteQuery);
  response.send("Movie Removed");
});

//directors
app.get("/directors/", async (request, response) => {
  const direcQuery = `
    SELECT * FROM director`;
  const director = await db.all(direcQuery);
  response.send(director);
});

//
app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const movieQuery = `
    SELECT movie_name FROM movie WHERE director_id = '${directorId}'`;
  const mv = await db.all(movieQuery);
  response.send(mv);
});

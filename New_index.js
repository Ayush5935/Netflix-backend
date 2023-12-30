const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('express-falcor');
const { Sequelize, DataTypes } = require('sequelize');

const app = express();
const port = 3000;

// Connect to PostgreSQL database
const sequelize = new Sequelize('postgres://username:password@localhost:5432/yourdatabase');

// Define Movie model
const Movie = sequelize.define('Movie', {
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  genre: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

sequelize.sync();

const model = {
  cache: {
    movies: [
      { $type: 'ref', value: ['moviesById', 1] },
      { $type: 'ref', value: ['moviesById', 2] },
    ],
    moviesById: {
      1: { id: 1, title: 'Inception', genre: 'Sci-Fi' },
      2: { id: 2, title: 'The Shawshank Redemption', genre: 'Drama' },
    },
  },
};

// Add these functions after the Sequelize model definition

const getMovies = async () => {
  return await Movie.findAll();
};

const getMovieById = async (id) => {
  return await Movie.findByPk(id);
};

const createMovie = async (data) => {
  return await Movie.create(data);
};

const updateMovie = async (id, data) => {
  const movie = await Movie.findByPk(id);
  if (movie) {
    return await movie.update(data);
  }
  return null;
};

const deleteMovie = async (id) => {
  const movie = await Movie.findByPk(id);
  if (movie) {
    await movie.destroy();
    return true;
  }
  return false;
};

// Update the model with database data

const updateModel = async () => {
  const movies = await getMovies();
  model.cache.movies = movies.map((movie) => ({ $type: 'ref', value: ['moviesById', movie.id] }));
  model.cache.moviesById = movies.reduce((acc, movie) => {
    acc[movie.id] = { id: movie.id, title: movie.title, genre: movie.genre };
    return acc;
  }, {});
};

// Add these routes after app.listen

app.use('/model.json', falcorExpress.dataSourceRoute(() => model));
app.use(bodyParser.json());

app.get('/movies', async (req, res) => {
  const movies = await getMovies();
  res.json(movies);
});

app.post('/movies', async (req, res) => {
  const { title, genre } = req.body;
  const newMovie = await createMovie({ title, genre });
  await updateModel();
  res.json(newMovie);
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const updatedMovie = await updateMovie(id, { title, genre });
  if (updatedMovie) {
    await updateModel();
    res.json(updatedMovie);
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await deleteMovie(id);
  if (deleted) {
    await updateModel();
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

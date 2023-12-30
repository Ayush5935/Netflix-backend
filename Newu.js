const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('express-falcor');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Replace with a strong secret key

// Connect to PostgreSQL database
const sequelize = new Sequelize('postgres://username:password@localhost:5432/yourdatabase');

// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

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
  description: {
    type: DataTypes.TEXT,
  },
  releaseDate: {
    type: DataTypes.DATE,
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
      1: { id: 1, title: 'Inception', genre: 'Sci-Fi', description: 'A mind-bending thriller.', releaseDate: '2010-07-16' },
      2: { id: 2, title: 'The Shawshank Redemption', genre: 'Drama', description: 'Two imprisoned men bond over a number of years.', releaseDate: '1994-09-10' },
    },
  },
};

const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('express-falcor');
const { Sequelize, DataTypes } = require('sequelize');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000;
const secretKey = 'your-secret-key'; // Replace with a strong secret key

// Connect to PostgreSQL database
const sequelize = new Sequelize('postgres://username:password@localhost:5432/yourdatabase');

// Define User model
const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

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
  description: {
    type: DataTypes.TEXT,
  },
  releaseDate: {
    type: DataTypes.DATE,
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
      1: { id: 1, title: 'Inception', genre: 'Sci-Fi', description: 'A mind-bending thriller.', releaseDate: '2010-07-16' },
      2: { id: 2, title: 'The Shawshank Redemption', genre: 'Drama', description: 'Two imprisoned men bond over a number of years.', releaseDate: '1994-09-10' },
    },
  },
};

// Add these functions after the Sequelize model definitions

const generateToken = (userId) => {
  return jwt.sign({ userId }, secretKey, { expiresIn: '1h' });
};

const registerUser = async (data) => {
  return await User.create(data);
};

const loginUser = async (username, password) => {
  return await User.findOne({ where: { username, password } });
};

// Add these routes after app.listen

app.post('/register', async (req, res) => {
  const { username, password } = req.body;
  const newUser = await registerUser({ username, password });
  const token = generateToken(newUser.id);
  res.json({ user: newUser, token });
});

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = await loginUser(username, password);
  if (user) {
    const token = generateToken(user.id);
    res.json({ user, token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.use('/model.json', falcorExpress.dataSourceRoute(() => model));
app.use(bodyParser.json());

app.get('/movies', async (req, res) => {
  const movies = await Movie.findAll();
  res.json(movies);
});

app.post('/movies', async (req, res) => {
  const { title, genre } = req.body;
  const newMovie = await Movie.create({ title, genre });
  model.cache.movies.push({ $type: 'ref', value: ['moviesById', newMovie.id] });
  model.cache.moviesById[newMovie.id] = { ...newMovie.dataValues };
  res.json(newMovie);
});

app.put('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const { title, genre } = req.body;
  const updatedMovie = await Movie.update({ title, genre }, { where: { id } });
  if (updatedMovie[0]) {
    model.cache.moviesById[id] = { id, title, genre };
    res.json({ id, title, genre });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;
  const deleted = await Movie.destroy({ where: { id } });
  if (deleted) {
    delete model.cache.moviesById[id];
    model.cache.movies = model.cache.movies.filter((movie) => movie.value[1] !== id);
    res.json({ success: true });
  } else {
    res.status(404).json({ error: 'Movie not found' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
￼Enter

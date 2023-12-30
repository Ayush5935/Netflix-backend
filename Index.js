const express = require('express');
const bodyParser = require('body-parser');
const falcorExpress = require('express-falcor');
const app = express();
const port = 3000;

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

app.use('/model.json', falcorExpress.dataSourceRoute(() => model));

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const Movie = require('../models/movie');
const BadRequest = require('../utils/errors/BadRequest');
const Forbidden = require('../utils/errors/Forbidden');
const NotFound = require('../utils/errors/NotFound');

module.exports.getMovieCards = (req, res, next) => {
  const owner = req.user._id;
  Movie.find({ owner })
    .then((movies) => res.send(movies))
    .catch((err) => next(err));
};

module.exports.createMovieCard = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner: req.user,
    movieId,
    nameRU,
    nameEN,
  })
    .then((movie) => res.send({ movie }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequest('Некорректные данные при создании карточки с фильмом :( '));
      } else {
        next(err);
      }
    });
};

module.exports.deleteMovieCard = (req, res, next) => {
  const { movieCardId } = req.params;
  Movie.findById(movieCardId)
    .then((movie) => {
      if (movie === null) {
        throw new NotFound('Фильм с указанным _id не найден :( ');
      }
      if (movie.owner.toString() !== req.user._id) {
        throw new Forbidden('Упс :( Вы не можете удалить фильм другого пользователя');
      }
      return movie.deleteOne().then(() => res.send({ message: 'Пост удалён' }));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequest('Некорректные данные для удаления фильма :('));
      } else {
        next(err);
      }
    });
};

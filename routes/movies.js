const router = require('express').Router();
const {
  getMovieCards,
  createMovieCard,
  deleteMovieCard,
} = require('../controllers/movies');
const {
  validateMovieCard,
  validateMovieCardId,
} = require('../utils/validators');

router.get('/', getMovieCards);
router.post('/', validateMovieCard, createMovieCard);
router.delete('/:movieCardId', validateMovieCardId, deleteMovieCard);

module.exports = router;

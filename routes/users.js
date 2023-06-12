const router = require('express').Router();
const {
  getCurrentUser,
  updateProfile,
} = require('../controllers/users');
const {
  validateProfile,
} = require('../utils/validators');

router.get('/me', getCurrentUser);
router.patch('/me', validateProfile, updateProfile);

module.exports = router;

const router = require('express').Router();
const { validateUserId, validateProfileUpdate, validateAvatarUpdate } = require('../utils/regex');

const {
  getUsers, getUserInfo, getUserById, updateUserProfile, updateUserAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUserInfo);

router.get('/:userId', validateUserId, getUserById);
router.patch('/me', validateProfileUpdate, updateUserProfile);
router.patch('/me/avatar', validateAvatarUpdate, updateUserAvatar);

module.exports = router;

const router = require('express').Router();

 const { getUsers, createUser, getUserById, updateUserProfile, updateUserAvatar } = require("../controllers/users");

 router.get('/', getUsers);
 router.get('/:userId', getUserById);
 router.post('/', createUser);
 router.patch('/me', updateUserProfile);
 router.patch('/me/avatar', updateUserAvatar);

 module.exports = router;
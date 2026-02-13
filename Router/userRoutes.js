
const express = require('express');
const { getAllUsers, registerUser, LoginUser, getMe, logoutUser } = require('../Controllers/userController');
const validateUser = require('../middelwares/validation');
const auth = require('../middelwares/AuthMiddleware');

const router = express.Router();

// Sample route to get all users
//http://localhost:3000/users/
router.get('/',getAllUsers);
router.post('/register',validateUser,registerUser);
router.post('/login', LoginUser)
router.get("/me", auth, getMe);
router.post("/logout", auth,logoutUser);


module.exports = router;
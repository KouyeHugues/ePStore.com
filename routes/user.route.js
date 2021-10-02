const express = require('express');
const router = express.Router();

//controllers
const authConroller = require('../controllers/authController');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth.middleware');

//auth
router.use('/register', authConroller.register)
router.use('/login', authConroller.login)
router.use('/logout', authConroller.logout);

//userRouters
router.use('/new', userController.newUser);
router.use('/user/:id', userController.getOneUser);
router.use('/update/:id', userController.updateUser);
router.use('/delete/:id', userController.deleteUser);
router.use('/', userController.getAllUsers);



module.exports = router;
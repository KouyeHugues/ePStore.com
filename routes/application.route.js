const express = require('express');
const router = express.Router();

//controllers
const applController = require('../controllers/applicationController');
const commentController = require('../controllers/commentController');
const uploadController = require('../controllers/uploadController');
const auth = require('../middleware/auth.middleware');
const multer = require('multer');
const upload = multer();



//applicationRouters
router.use('/index/new', upload.single("file"), applController.newAppl);
router.use('/home/:id', applController.getOneAppl);
router.use('/update/index/:id', upload.single("file"), applController.updateAppl);
router.use('/delete/index/:id', applController.deleteAppl);
router.use('/index', applController.getAllAppl);
router.use('/home', applController.getAllApplHome);
router.use('/appl-viewed/:id', applController.viewed);
router.use('/appl-visitor/:id', applController.visitor);


// comments
router.use('/comment/:id', commentController.getOneComment);
router.use('/new-comment/:id', commentController.newComment);
router.use('/edit-comment/:id', commentController.updateComment);
router.use('/delete-comment/:id', commentController.deleteComment);
router.use('/all-comments/', commentController.allComment);




module.exports = router;
const express = require('express');
const router = express.Router();
const postsController = require('../controllers/postsController');
const commentsRouter = require('./comments');

router.get('/', postsController.getAllPosts);
router.get('/:id', postsController.getPostById);
router.post('/', postsController.createPost);
router.put('/:id', postsController.updatePost);
router.delete('/:id', postsController.deletePost);

// Nested comments routes
router.use('/:postId/comments', commentsRouter);

module.exports = router;

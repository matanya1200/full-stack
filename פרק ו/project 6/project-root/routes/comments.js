const express = require('express');
const router = express.Router({ mergeParams: true });
const commentsController = require('../controllers/commentsController');

// ✅ גישה ישירה עם query (כמו /comments?postId=1)
router.get('/', commentsController.getAllCommentsByPost);

// ✅ nested בתוך פוסט
router.get('/:commentId', commentsController.getCommentById);//לא נצרך כעת
router.post('/', commentsController.createComment);
router.put('/:commentId', commentsController.updateComment);
router.delete('/:commentId', commentsController.deleteComment);

module.exports = router;

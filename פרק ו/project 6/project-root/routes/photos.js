const express = require('express');
const router = express.Router({ mergeParams: true });
const photosController = require('../controllers/photosController');

// ✅ גישה ישירה עם query (כמו /comments?postId=1)
router.get('/', photosController.getPhotosByAlbume);

// ✅ nested בתוך פוסט
router.get('/:photoId', photosController.getPhotoById);//לא נצרך כעת
router.post('/', photosController.createPhoto);
router.put('/:photoId', photosController.updatePhoto);
router.delete('/:photoId', photosController.deletePhoto);

module.exports = router;

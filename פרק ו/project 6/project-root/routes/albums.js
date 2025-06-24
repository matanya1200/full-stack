const express = require('express');
const router = express.Router();
const albumsController = require('../controllers/albumsController');
const commentsRouter = require('./photos');

router.get('/', albumsController.getAllAlbums);
router.get('/:id', albumsController.getAlbumById);
router.post('/', albumsController.createAlbum);
router.put('/:id', albumsController.updateAlbum);
router.delete('/:id', albumsController.deleteAlbum);

// Nested comments routes
router.use('/:albumId/photos', commentsRouter);

module.exports = router;

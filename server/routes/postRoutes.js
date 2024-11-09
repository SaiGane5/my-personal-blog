const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { upload } = require('../middleware/upload');
const {
    getPosts,
    getPost,
    createPost,
    updatePost,
    deletePost,
    uploadImage
} = require('../controllers/postController');

router.get('/', getPosts);
router.get('/:slug', getPost);
router.post('/', protect, upload.single('image'), createPost);
router.put('/:id', protect, upload.single('image'), updatePost);
router.delete('/:id', protect, deletePost);
router.post('/upload', protect, upload.single('image'), uploadImage);

module.exports = router;
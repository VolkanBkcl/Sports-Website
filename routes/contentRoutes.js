const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const auth = require('../middleware/auth');

// Blog route'ları
router.post('/blog', auth, contentController.createBlogPost);
router.post('/blog/:blogId/comment', auth, contentController.addCommentToBlog);
router.post('/blog/:blogId/like', auth, contentController.likeContent);

// Forum route'ları
router.post('/forum', auth, contentController.createForumPost);
router.post('/forum/:forumId/reply', auth, contentController.addReplyToForum);
router.post('/forum/:forumId/like', auth, contentController.likeContent);

module.exports = router; 
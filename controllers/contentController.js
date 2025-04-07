const Blog = require('../models/Blog');
const Forum = require('../models/Forum');

// Blog yazısı oluşturma
exports.createBlogPost = async (req, res) => {
    try {
        const { title, content, category, tags, imageUrl } = req.body;
        const author = req.user.userId;

        const blogPost = new Blog({
            title,
            content,
            author,
            category,
            tags,
            imageUrl
        });

        await blogPost.save();

        res.status(201).json({
            message: 'Blog yazısı başarıyla oluşturuldu',
            blogPost
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Blog yazısına yorum ekleme
exports.addCommentToBlog = async (req, res) => {
    try {
        const { blogId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        const blogPost = await Blog.findById(blogId);
        if (!blogPost) {
            return res.status(404).json({ message: 'Blog yazısı bulunamadı' });
        }

        blogPost.comments.push({
            user: userId,
            content
        });

        await blogPost.save();

        res.status(200).json({
            message: 'Yorum başarıyla eklendi',
            comments: blogPost.comments
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Forum gönderisi oluşturma
exports.createForumPost = async (req, res) => {
    try {
        const { title, content, category, tags } = req.body;
        const author = req.user.userId;

        const forumPost = new Forum({
            title,
            content,
            author,
            category,
            tags
        });

        await forumPost.save();

        res.status(201).json({
            message: 'Forum gönderisi başarıyla oluşturuldu',
            forumPost
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// Forum gönderisine yanıt ekleme
exports.addReplyToForum = async (req, res) => {
    try {
        const { forumId } = req.params;
        const { content } = req.body;
        const userId = req.user.userId;

        const forumPost = await Forum.findById(forumId);
        if (!forumPost) {
            return res.status(404).json({ message: 'Forum gönderisi bulunamadı' });
        }

        forumPost.replies.push({
            user: userId,
            content
        });

        await forumPost.save();

        res.status(200).json({
            message: 'Yanıt başarıyla eklendi',
            replies: forumPost.replies
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
};

// İçerik beğenme
exports.likeContent = async (req, res) => {
    try {
        const { type, contentId } = req.params;
        const userId = req.user.userId;

        let content;
        if (type === 'blog') {
            content = await Blog.findById(contentId);
        } else if (type === 'forum') {
            content = await Forum.findById(contentId);
        }

        if (!content) {
            return res.status(404).json({ message: 'İçerik bulunamadı' });
        }

        if (type === 'blog') {
            if (!content.likes.includes(userId)) {
                content.likes.push(userId);
            }
        } else if (type === 'forum') {
            if (!content.replies[content.replies.length - 1].likes.includes(userId)) {
                content.replies[content.replies.length - 1].likes.push(userId);
            }
        }

        await content.save();

        res.status(200).json({
            message: 'İçerik başarıyla beğenildi',
            likes: type === 'blog' ? content.likes : content.replies[content.replies.length - 1].likes
        });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası', error: error.message });
    }
}; 
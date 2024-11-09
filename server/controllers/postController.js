const Post = require('../models/Post');
const cloudinary = require('../config/cloudinary');
const marked = require('marked');

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, category, tag, search } = req.query;

        const query = {};
        if (category) query.category = category;
        if (tag) query.tags = tag;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { content: { $regex: search, $options: 'i' } }
            ];
        }

        const posts = await Post.find(query)
            .populate('category', 'name slug')
            .populate('author', 'username')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .exec();

        const count = await Post.countDocuments(query);

        res.json({
            success: true,
            posts,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

exports.createPost = async (req, res) => {
    try {
        const { title, content, excerpt, category, tags, status } = req.body;

        let coverImage = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'blog'
            });
            coverImage = {
                url: result.secure_url,
                publicId: result.public_id
            };
        }

        const post = await Post.create({
            title,
            content,
            excerpt,
            category,
            tags,
            status,
            coverImage,
            author: req.admin.id,
            html: marked(content)
        });

        res.status(201).json({
            success: true,
            post
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

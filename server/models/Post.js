const mongoose = require('mongoose');
const slugify = require('slugify');

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    slug: String,
    content: {
        type: String,
        required: [true, 'Please add content']
    },
    excerpt: {
        type: String,
        required: [true, 'Please add an excerpt'],
        maxlength: [200, 'Excerpt cannot be more than 200 characters']
    },
    coverImage: {
        url: String,
        publicId: String
    },
    tags: [{
        type: String,
        required: true
    }],
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin',
        required: true
    },
    readingTime: Number,
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },
    views: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

PostSchema.pre('save', function (next) {
    this.slug = slugify(this.title, { lower: true });
    next();
});

PostSchema.pre('save', function (next) {
    const wordsPerMinute = 200;
    const wordCount = this.content.trim().split(/\s+/).length;
    this.readingTime = Math.ceil(wordCount / wordsPerMinute);
    next();
});

module.exports = mongoose.model('Post', PostSchema);
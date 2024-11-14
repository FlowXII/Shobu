import Post from '../models/Post.js';
import { validatePost } from '../validators/postValidator.js';

export const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    const validationError = validatePost({ content });
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const post = new Post({
      userId: req.user._id,
      content
    });

    await post.save();
    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Failed to create post' });
  }
};

export const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('userId', 'username startgg.profile.images')
      .lean();

    const total = await Post.countDocuments();

    res.json({
      posts,
      pagination: {
        current: page,
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get feed posts error:', error);
    res.status(500).json({ error: 'Failed to fetch posts' });
  }
}; 
import Post from '../models/Post.js';
import { validatePost } from '../validators/postValidator.js';
import { catchAsync } from '../utils/catchAsync.js';
import { ValidationError } from '../utils/errors.js';
import { 
  sendCreatedResponse,
  sendListResponse
} from '../utils/responseHandler.js';

export const createPost = catchAsync(async (req, res) => {
  const { content } = req.body;

  const validationError = validatePost({ content });
  if (validationError) {
    throw new ValidationError(validationError);
  }

  const post = new Post({
    userId: req.user._id,
    content
  });

  await post.save();
  
  return sendCreatedResponse({
    res,
    data: post,
    message: 'Post created successfully'
  });
});

export const getFeedPosts = catchAsync(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;

  const posts = await Post.find()
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(limit)
    .populate('userId', 'username startgg.profile.images')
    .lean();

  const total = await Post.countDocuments();

  return sendListResponse({
    res,
    data: posts,
    meta: {
      pagination: {
        current: page,
        total: Math.ceil(total / limit)
      }
    }
  });
}); 
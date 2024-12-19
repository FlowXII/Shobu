import Conversation from '../models/Conversation.js';
import User from '../models/User.js';
import logger from '../utils/logger.js';
import Message from '../models/Message.js';

export const createConversation = async (req, res) => {
  try {
    const { participantIds, type = 'DIRECT', name } = req.body;
    const userId = req.user._id;

    // Ensure current user is included in participants
    const allParticipants = [...new Set([...participantIds, userId.toString()])];

    // Validate participants exist
    const participants = await User.find({ _id: { $in: allParticipants } });
    if (participants.length !== allParticipants.length) {
      return res.status(400).json({ error: 'One or more participants not found' });
    }

    // For direct messages, check if conversation already exists
    if (type === 'DIRECT' && allParticipants.length === 2) {
      const existingConversation = await Conversation.findOne({
        type: 'DIRECT',
        participants: { $all: allParticipants }
      });

      if (existingConversation) {
        return res.status(200).json(existingConversation);
      }
    }

    const conversation = new Conversation({
      participants: allParticipants,
      type,
      name: type === 'GROUP' ? name : undefined,
      metadata: {
        unreadCounts: allParticipants.reduce((acc, id) => {
          acc.set(id.toString(), 0);
          return acc;
        }, new Map())
      }
    });

    await conversation.save();
    await conversation.populate('participants', 'username startgg.profile.images');

    res.status(201).json(conversation);
  } catch (error) {
    logger.error('Create conversation error:', error);
    res.status(500).json({ error: 'Failed to create conversation' });
  }
};

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;

    // Get all conversations for the user
    const conversations = await Conversation.find({
      participants: userId,
      isActive: true
    })
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .populate('participants', 'username startgg.profile.images')
      .populate('lastMessage')
      .lean();

    // Get the total number of conversations for pagination
    const total = await Conversation.countDocuments({
      participants: userId,
      isActive: true
    });

    // Return the conversations and pagination metadata
    res.json({
      conversations,
      pagination: {
        current: page,
        total: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    logger.error('Get conversations error:', error);
    res.status(500).json({ error: 'Failed to fetch conversations' });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Soft delete by marking as inactive
    conversation.isActive = false;
    await conversation.save();

    res.json({ success: true });
  } catch (error) {
    logger.error('Delete conversation error:', error);
    res.status(500).json({ error: 'Failed to delete conversation' });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    // First verify the user is a participant in this conversation
    const conversation = await Conversation.findOne({
      _id: conversationId,
      participants: userId,
      isActive: true
    });

    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    const messages = await Message.find({ conversation: conversationId })
      .sort({ createdAt: -1 })
      .populate('sender', 'username startgg.profile.images')
      .lean();

    res.json({ messages });
  } catch (error) {
    logger.error('Get conversation messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
}; 
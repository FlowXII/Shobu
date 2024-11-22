import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';
import logger from '../utils/logger.js';

export const sendMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // Check if user is participant
    if (!conversation.participants.includes(senderId)) {
      return res.status(403).json({ error: 'Not authorized to send messages in this conversation' });
    }

    const message = new Message({
      sender: senderId,
      conversation: conversationId,
      content,
      readBy: [senderId]
    });

    await message.save();
    
    // Fully populate the sender
    const populatedMessage = await Message.findById(message._id)
      .populate({
        path: 'sender',
        select: 'username startgg.profile.images _id'
      });

    // Update conversation's last message and unread counts
    const updateOperations = conversation.participants
      .filter(p => !p.equals(senderId))
      .reduce((acc, participantId) => ({
        ...acc,
        [`metadata.unreadCounts.${participantId}`]: 1
      }), {});

    await Conversation.findByIdAndUpdate(conversationId, {
      lastMessage: message._id,
      $inc: updateOperations
    });

    // Use the populated message for both socket and response
    if (req.io) {
      req.io.to(conversationId).emit('new_message', populatedMessage);
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    logger.error('Send message error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
};

export const getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Message.find({
      conversation: conversationId,
      deleted: false
    })
      .sort({ createdAt: 1 })
      .populate({
        path: 'sender',
        select: 'username startgg.profile.images _id'
      })
      .lean();

    res.json({ messages });
  } catch (error) {
    logger.error('Get messages error:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const userId = req.user._id;

    await Message.updateMany(
      {
        conversation: conversationId,
        readBy: { $ne: userId }
      },
      {
        $addToSet: { readBy: userId }
      }
    );

    // Reset unread count for user
    await Conversation.findByIdAndUpdate(conversationId, {
      $set: { [`metadata.unreadCounts.${userId}`]: 0 }
    });

    res.json({ success: true });
  } catch (error) {
    logger.error('Mark as read error:', error);
    res.status(500).json({ error: 'Failed to mark messages as read' });
  }
}; 
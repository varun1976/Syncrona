import mongoose from "mongoose";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ success: false, code: "CONTACTS_FETCH_FAILED", message: "Failed to load chat contacts." });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const myId = req.user._id;
    const cursor = req.query.cursor;
    const since = req.query.since;
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 50, 1), 100);

    if (!mongoose.Types.ObjectId.isValid(userToChatId)) {
      return res.status(400).json({
        success: false,
        code: "INVALID_USER_ID",
        message: "Invalid contact specified.",
      });
    }

    // Handle background synchronization (fetching messages newer than `since`)
    if (since) {
      let sinceFilter = {};
      if (mongoose.Types.ObjectId.isValid(since)) {
        const sinceMsg = await Message.findById(since).select("createdAt _id").lean();
        if (sinceMsg) {
          sinceFilter = {
            $or: [
              { createdAt: { $gt: sinceMsg.createdAt } },
              {
                createdAt: sinceMsg.createdAt,
                _id: { $gt: sinceMsg._id },
              },
            ],
          };
        } else {
          sinceFilter = { _id: { $gt: since } };
        }
      }

      const syncMessages = await Message.find({
        $or: [
          { senderId: myId, receiverId: userToChatId },
          { senderId: userToChatId, receiverId: myId },
        ],
        ...sinceFilter,
      })
        .sort({ createdAt: 1, _id: 1 })
        .limit(limit)
        .lean();

      return res.status(200).json({
        success: true,
        messages: syncMessages,
        isSync: true,
      });
    }

    let cursorFilter = {};
    if (cursor) {
      if (!mongoose.Types.ObjectId.isValid(cursor)) {
        return res.status(400).json({
          success: false,
          code: "INVALID_CURSOR",
          message: "Invalid pagination cursor provided.",
        });
      }

      const cursorMsg = await Message.findById(cursor).select("createdAt _id").lean();
      if (cursorMsg) {
        cursorFilter = {
          $or: [
            { createdAt: { $lt: cursorMsg.createdAt } },
            {
              createdAt: cursorMsg.createdAt,
              _id: { $lt: cursorMsg._id },
            },
          ],
        };
      } else {
        cursorFilter = { _id: { $lt: cursor } };
      }
    }

    const rawMessages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
      ...cursorFilter,
    })
      .sort({ createdAt: -1, _id: -1 })
      .limit(limit + 1)
      .lean();

    const hasMore = rawMessages.length > limit;
    const pageMessages = hasMore ? rawMessages.slice(0, limit) : rawMessages;

    const nextCursor =
      hasMore && pageMessages.length > 0
        ? pageMessages[pageMessages.length - 1]._id.toString()
        : null;

    const chronologicalMessages = pageMessages.reverse();

    return res.status(200).json({
      success: true,
      messages: chronologicalMessages,
      hasMore,
      nextCursor,
    });
  } catch (error) {
    console.error("Error in getMessages controller: ", error.message);
    res.status(500).json({
      success: false,
      code: "MESSAGES_FETCH_FAILED",
      message: "Failed to load conversation history.",
    });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { text, image, tempId } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    if (!text?.trim() && !image) {
      return res.status(400).json({
        success: false,
        code: "EMPTY_MESSAGE",
        message: "Message must contain text or an image attachment.",
      });
    }

    const receiverUser = await User.findById(receiverId);
    if (!receiverUser) {
      return res.status(404).json({
        success: false,
        code: "RECEIVER_NOT_FOUND",
        message: "The message recipient could not be found.",
      });
    }

    let imageUrl;
    if (image) {
      try {
        // Upload base64 image to Cloudinary
        const uploadResponse = await cloudinary.uploader.upload(image, {
          folder: "syncrona_chats",
        });
        imageUrl = uploadResponse.secure_url;
      } catch (cloudinaryError) {
        console.error("Cloudinary upload failed in sendMessage:", cloudinaryError.message);
        return res.status(400).json({
          success: false,
          code: "STORAGE_UPLOAD_FAILED",
          message: "We couldn't upload your image right now. Please try another image or try again later.",
        });
      }
    }

    let newMessage;
    try {
      newMessage = new Message({
        senderId,
        receiverId,
        text: text?.trim() || "",
        image: imageUrl || "",
        tempId: tempId || "",
      });

      await newMessage.save();
    } catch (dbError) {
      console.error("Database save failed in sendMessage:", dbError.message);
      return res.status(500).json({
        success: false,
        code: "MESSAGE_SAVE_FAILED",
        message: "The image could not be attached to your message. Please try again.",
      });
    }

    try {
      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage);
      }
    } catch (socketError) {
      console.error("Socket notification error in sendMessage:", socketError.message);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Unhandled error in sendMessage controller: ", error.message);
    res.status(500).json({
      success: false,
      code: "SEND_MESSAGE_FAILED",
      message: "Unable to send message. Please try again.",
    });
  }
};
const asyncHandler = require("express-async-handler");
const Note = require("../models/note.model");
const  logger  = require('../pino_logger');
const {globalErrorHandler} = require('../middleware/globalErrorHandler');

const addNote = asyncHandler( async (req, res, next) => {
    const { title, content, tags, isPinned } = req.body;
    logger.info(`Note add request by  ${req.user.id}`);
    if (!title || !content) {
      return next(globalErrorHandler(400, "Title and Content are required"))
    }
  
    try {
      const note = new Note({
        title,
        content,
        tags: tags || [],
        isPinned: isPinned || false,
        userId: req.user.id,
        createdOn: new Date().getTime(),
      });
  
      await note.save();
      logger.info(`Note added successfully  ${note}`);
      res.status(201).json({
        error: false,
        note,
        message: "Note added successfully",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
    }
  });
// edit note api
const editNote = asyncHandler( async (req, res, next) => {
    const noteId = req.params.id;
    const userId = req.user.id;
    logger.info(`Note edit request by  ${userId}: ${noteId}`);
    const { title, content, tags, isPinned } = req.body;
  
    try {
      // Find the note by ID and ensure it belongs to the authenticated user
      const note = await Note.findOne({ _id: noteId, userId: userId });
  
      if (!note) {
        logger.info(`No note found ${userId}: ${noteId}`);
        return next(globalErrorHandler(404, "Note not found"))
        
      }
  
      // Update the note fields
      if (title !== undefined) note.title = title;
      if (content !== undefined) note.content = content;
      if (tags !== undefined) note.tags = tags;
      if (isPinned !== undefined) note.isPinned = isPinned;
  
      await note.save();
      logger.info(`Note updated successfully  ${note}`);
      res.status(200).json({
        error: false,
        note,
        message: "Note updated successfully",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
      
    }
  });
// Delete notes
const deleteNote = asyncHandler(async (req, res, next) => {
  const noteId = req.params.id;
  const userId = req.user.id;
  logger.info(`Note delete request by  ${userId}: ${noteId}`);

  try {
    // Find the note by ID and ensure it belongs to the authenticated user
    const note = await Note.findOneAndDelete({ _id: noteId, userId: userId });
    
    if (!note) {
      logger.info(`Note not found  ${userId}: ${noteId}`);
      return next(globalErrorHandler(404, "Note not found"))
    }

    res.status(200).json({
      error: false,
      message: "Note deleted successfully",
    });
  } catch (error) {
    logger.error(error,"Internal Server Error");
    next(error)
    
  }
});
// Get all notes of the user
const getNotes = asyncHandler( async (req, res, next) => {
    try {
      const notes = await Note.find({ userId: req.user.id }).sort({ isPinned: -1 })
      logger.info(`All notes of  ${req.user.id}: ${notes}`);
      res.status(200).json({
        error: false,
        notes,
        message: "Notes retrieved successfully",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
    }
  });

// update isPinned value
const isPinned = asyncHandler( async (req, res, next) => {
    const noteId = req.params.id;
    const userId = req.user.id;
    logger.info(`note pinned by user ${userId}: ${noteId}`);
    try {
      // Find the note by ID and ensure it belongs to the authenticated user
      const note = await Note.findOne({ _id: noteId, userId: userId });
  
      if (!note) {
        logger.info(`Note not found or you do not have permission to pin/unpin this note`);
        return next(globalErrorHandler(404, "Note not found!"))
      }
  
      // Toggle the isPinned field
      note.isPinned = !note.isPinned;
      await note.save();
  
      res.status(200).json({
        error: false,
        note,
        message: "Note pin status updated successfully",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
        
    }
  });

// search for note
  const searchNotes = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const { query } = req.query
    
    logger.info(`query made by user ${query}: ${userId}`);
    if (!query) {
      return next(globalErrorHandler(400, "Search query is required"))
    }
  
    try {
      const matchingNotes = await Note.find({
        userId: req.user.id,
        $or: [
          { title: { $regex: new RegExp(query, "i") } },
          { content: { $regex: new RegExp(query, "i") } },
        ],
       })
       
       logger.info(`Notes found successfully`);
      return res.json({
        error: false,
        notes: matchingNotes,
        message: "Notes found successfully",
      });
    } catch (error) {
      logger.error(error,"Internal Server Error");
      next(error)
    }







  });
  
  module.exports = { searchNotes, isPinned, getNotes, editNote ,deleteNote, addNote};
  
  
const express = require('express');
const router = express.Router();
const authenticate= require("../middleware/utilities");
const { searchNotes, isPinned, getNotes, editNote ,deleteNote, addNote} = require('../controllers/note.controllers');

router.route("/add-note").post(authenticate, addNote)
router.route("/search-notes/").get(authenticate, searchNotes)
router.route("/update-note-pinned/:id").put(authenticate, isPinned)
router.route("/get-all-notes").get(authenticate, getNotes)
router.route("/edit-note/:id").put(authenticate, editNote)
router.route("/delete-note/:id").delete(authenticate, deleteNote)


module.exports = router; 
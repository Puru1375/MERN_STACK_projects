import express from 'express';
import { createNote, deleteNote, getNotes, updateNote, getNotesById } from '../controllers/noteController.js';

const router = express.Router();

router.get('/', getNotes);

router.get('/:id', getNotesById); // Assuming you have a function to get a note by ID

router.post('/', createNote);

router.put('/:id', updateNote);

router.delete('/:id', deleteNote)



export default router;


import { Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { createNote, deleteNote, getNoteDetails, updateNoteDetails } from '../controllers/notes'
import { validations } from '../validations'
const router = Router()

router.post('/', [validations.noteValidations.createNoteValidations, authGuard], createNote)
router.get('/:id', [validations.noteValidations.validateNoteId, authGuard], getNoteDetails)
router.put('/:id', [validations.noteValidations.updateNoteValidation, authGuard], updateNoteDetails)
router.delete('/:id',[validations.noteValidations.validateNoteId, authGuard], deleteNote)

export default router
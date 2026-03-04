import { Request, Response, Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { createNoteBook, getNoteBookList, getNoteBookDetails, updateNoteBook, deleteNoteBook } from '../controllers/noteBook'
import { validations } from '../validations'
const router = Router()

router.get('/list', [authGuard], getNoteBookList)
router.put('/:id',[authGuard], [validations.noteBookValidations.validateNoteBookIdValidations, validations.noteBookValidations.updateNoteBookValidations], updateNoteBook)
router.delete('/:id',[authGuard], [validations.noteBookValidations.validateNoteBookIdValidations], deleteNoteBook)
router.post('/',[authGuard], [validations.noteBookValidations.createNoteBookValidations], createNoteBook)
router.get("/:id",[authGuard, validations.noteBookValidations.validateNoteBookIdValidations], getNoteBookDetails)

export default router
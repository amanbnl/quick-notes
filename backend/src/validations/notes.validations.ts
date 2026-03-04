import Joi from 'joi'
import { noteBookIdSchema } from './noteBook.validations';


const noteIdValidation = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid id'
  });

const titleValidation = Joi.string()
  .min(3)
  .max(50)
  .message("title must be between 3 and 50 characters long")
const jsonBodyValidation = Joi.string()

export const fetchNoteDetailsSchema = Joi.object({
  id: noteIdValidation
});



export const createNoteSchema = Joi.object({
  title: titleValidation,
  jsonBody: jsonBodyValidation,
  notebookId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      'string.pattern.base': 'Invalid note book id'
    })
})

export const updateNoteValidationSchema = Joi.object({
  id: noteIdValidation,
  title: titleValidation,
  jsonBody: jsonBodyValidation,
});

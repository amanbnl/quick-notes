import Joi from 'joi'


const workSpaceIdValidation = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid id'
  });

const workSpaceName = Joi.string()
  .min(3)
  .max(50)
  .message("workspace name must be between 3 and 50 characters long")

export const fetchWorkSpaceDetailsSchema = Joi.object({
  id: workSpaceIdValidation
});

export const createWorkSpaceValidationSchema = Joi.object({
  name: workSpaceName,
})

export const updateWorkSpaceValidationSchema = Joi.object({
  id: workSpaceIdValidation,
  name: workSpaceName
});

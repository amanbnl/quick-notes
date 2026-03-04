import Joi from 'joi'
import { INVALID_PASSWORD_MESSAGE } from '../lib/constants'

export const createUserValidationSchema = Joi.object({
  email: Joi.string().required().email(),
  fullName: Joi.string().required().min(3).max(50).message("Name must be between 30 to 50 characters long"),
  password: Joi.string().required()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(
      INVALID_PASSWORD_MESSAGE
    )
    .required()
})
const userIdValidation = Joi.string()
  .regex(/^[0-9a-fA-F]{24}$/)
  .required()
  .messages({
    'string.pattern.base': 'Invalid user id'
  });

export const fetchUserDetailsSchema = Joi.object({
  id: userIdValidation
});

export const updateUserValidationSchema = Joi.object({
  id: userIdValidation,
  fullName: Joi.string()
    .min(3)
    .max(50)
    .message("Name must be between 3 and 50 characters long")
});

export const verifyUserDetailsSchema = Joi.object({
  token: Joi.string().required()
})

export const loginUserRequestSchema = Joi.object({
  email: Joi.string().required().email(),
  password: Joi.string().required()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(
      INVALID_PASSWORD_MESSAGE
    )
    .required()
})

export const resetPasswordValidationSchema = Joi.object({
  oldPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(INVALID_PASSWORD_MESSAGE)
    .required(),

  newPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(INVALID_PASSWORD_MESSAGE)
    .required(),

  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Confirm password must match the new password',
    }),
});

export const forgotPasswordValidationSchema = Joi.object({
  // 1. Define the Step parameter (must be step1 or step2)
  step: Joi.string()
    .valid('step1', 'step2')
    .required()
    .messages({
      'any.only': 'Step must be either "step1" or "step2"'
    }),

  // 2. Email field: Required ONLY if step is "step1"
  email: Joi.string()
    .email()
    .when('step', {
      is: 'step1',
      then: Joi.required(),
      otherwise: Joi.optional() // Can be excluded in step2
    }),

  // 3. New Password: Required ONLY if step is "step2"
  newPassword: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Za-z])(?=.*\d).+$/)
    .message(INVALID_PASSWORD_MESSAGE)
    .when('step', {
      is: 'step2',
      then: Joi.required(),
      otherwise: Joi.forbidden() // Should NOT be sent in step1
    }),

  // 4. Confirm Password: Must match newPassword IF step is "step2"
  confirmPassword: Joi.string()
    .when('step', {
      is: 'step2',
      then: Joi.valid(Joi.ref('newPassword')).required(),
      otherwise: Joi.forbidden()
    })
    .messages({
      'any.only': 'Passwords do not match'
    })
});
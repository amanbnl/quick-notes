import { Router } from "express";
import { createUser, deleteUserDetails, fetchUserDetails, forgotPassword, loginUser, resetPassword, searchUser, updateUserDetails, verifyUser } from "../controllers/users";
import { validations } from "../validations";
import { authGuard, forgotPasswordGuard } from "../guards/auth.guard";

const router = Router()

router.get("/activate-user-account", [validations.userValidations.verifyUserValidations], verifyUser)
router.post("/auth/login", [validations.userValidations.loginUserValidation], loginUser)
router.get('/search',[authGuard], searchUser)
router.post('/reset-password', [authGuard, validations.userValidations.resetPasswordValidations], resetPassword)
router.post('/forgot-password', [forgotPasswordGuard, validations.userValidations.forgotPasswordvalidations], forgotPassword)
router.get('/:id', [validations.userValidations.validateUserId, authGuard], fetchUserDetails)
router.post('/', [validations.userValidations.createUserValidations], createUser)
router.put('/:id', [authGuard, validations.userValidations.updateUserValidations], updateUserDetails)
router.delete("/:id", [validations.userValidations.validateUserId, authGuard], deleteUserDetails)

export default router

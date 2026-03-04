import { Router } from 'express'
import { authGuard } from '../guards/auth.guard'
import { validations } from '../validations'
import { createWorkSpace, deleteWorkSpace, getWorkSpaceDetails, getWorkSpaceList, inviteUserToWorkSpace, revokeUserAccess, updateWorkSpace } from '../controllers/workSpace'
const router = Router()


router.get('/list', [authGuard], getWorkSpaceList)
router.post('/invite', [authGuard], inviteUserToWorkSpace)
router.post('/revoke-access', [authGuard], revokeUserAccess)
router.get('/:id', [authGuard, validations.workSpaceValdations.validateWorkSpaceId], getWorkSpaceDetails)
router.post('/', [authGuard, validations.workSpaceValdations.createWorkSpaceValidations], createWorkSpace)
router.put('/:id', [authGuard, validations.workSpaceValdations.updateWorkSpaceValidations], updateWorkSpace)
router.delete('/:id', [authGuard, validations.workSpaceValdations.validateWorkSpaceId], deleteWorkSpace)



export default router
/* eslint-disable @typescript-eslint/no-explicit-any */
import express, { NextFunction, Request, Response } from 'express';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { USER_ROLE } from './user.constant';
import { UserControllers } from './user.controller';
import { UserValidation } from './user.validation';
import { upload } from '../../utils/sendImageToCloudinary';

const router = express.Router();

router.post(
  '/create-user',
  // auth(USER_ROLE.superAdmin, USER_ROLE.admin),
  upload.single('file'),
  (req: Request, res: Response, next: NextFunction) => {
    // req.body = JSON.parse(req.body?.data);
    if (req.body.data) {
      req.body = JSON.parse(req.body.data);
    }

    next();
  },
  validateRequest(UserValidation.createUserValidationSchema),
  UserControllers.createUser,
);

// router.post(
//   '/change-status/:id',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   validateRequest(UserValidation.changeStatusValidationSchema),
//   UserControllers.changeStatus,
// );

// router.get(
//   '/me',
//   auth(
//     USER_ROLE.superAdmin,
//     USER_ROLE.admin,
//     USER_ROLE.boardMember,
//     USER_ROLE.managementTeam,
//     USER_ROLE.volunteer,
//     USER_ROLE.user,
//   ),
//   UserControllers.getMe,
// );

// router.patch(
//   '/update-role/:id',
//   auth(USER_ROLE.superAdmin, USER_ROLE.admin),
//   validateRequest(UserValidation.updateUserRoleValidationSchema),
//   UserControllers.updateUserRole,
// );

export const UserRoutes = router;

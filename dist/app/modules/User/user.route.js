"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
/* eslint-disable @typescript-eslint/no-explicit-any */
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const user_controller_1 = require("./user.controller");
const user_validation_1 = require("./user.validation");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const router = express_1.default.Router();
router.post('/create-user', 
// auth(USER_ROLE.superAdmin, USER_ROLE.admin),
sendImageToCloudinary_1.upload.single('file'), (req, res, next) => {
    // req.body = JSON.parse(req.body?.data);
    if (req.body.data) {
        req.body = JSON.parse(req.body.data);
    }
    next();
}, (0, validateRequest_1.default)(user_validation_1.UserValidation.createUserValidationSchema), user_controller_1.UserControllers.createUser);
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
exports.UserRoutes = router;

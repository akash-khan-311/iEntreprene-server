"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const auth_controller_1 = require("./auth.controller");
const auth_validation_1 = require("./auth.validation");
const router = express_1.default.Router();
router.post('/login', (0, validateRequest_1.default)(auth_validation_1.AuthValidation.loginValidationSchema), auth_controller_1.AuthControllers.loginUser);
// router.post(
//   '/change-password',
//   auth(
//     USER_ROLE.superAdmin,
//     USER_ROLE.admin,
//     USER_ROLE.boardMember,
//     USER_ROLE.managementTeam,
//     USER_ROLE.volunteer,
//     USER_ROLE.user, 
//   validateRequest(AuthValidation.changePasswordValidationSchema),
//   AuthControllers.changePassword,
// ));
// router.post(
//   '/refresh-token',
//   validateRequest(AuthValidation.refreshTokenValidationSchema),
//   AuthControllers.refreshToken,
// );
// router.post(
//   '/forget-password',
//   validateRequest(AuthValidation.forgetPasswordValidationSchema),
//   AuthControllers.forgetPassword,
// );
// router.post(
//   '/reset-password',
//   validateRequest(AuthValidation.resetPasswordValidationSchema),
//   AuthControllers.resetPassword,
// );
exports.AuthRoutes = router;

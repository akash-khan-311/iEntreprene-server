"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserServices = void 0;
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
const bcrypt_1 = __importDefault(require("bcrypt"));
const config_1 = __importDefault(require("../../config"));
const user_constant_1 = require("./user.constant");
const user_model_1 = require("./user.model");
const sendImageToCloudinary_1 = require("../../utils/sendImageToCloudinary");
const createUserIntoDB = (file, payload) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const userData = Object.assign({}, payload);
    // Set defaults if not provided
    userData.role = userData.role || user_constant_1.USER_ROLE.user;
    userData.status = userData.status || 'active';
    userData.isDeleted = (_a = userData.isDeleted) !== null && _a !== void 0 ? _a : false;
    // Handle profile image upload
    if (file && file.path) {
        const imageName = `${userData.email}_${(_b = userData === null || userData === void 0 ? void 0 : userData.name) === null || _b === void 0 ? void 0 : _b.firstName}`;
        const { secure_url } = yield (0, sendImageToCloudinary_1.sendImageToCloudinary)(imageName, file.path);
        userData.profileImg = secure_url;
    }
    // Hash password
    if (userData.password) {
        userData.password = yield bcrypt_1.default.hash(userData.password, Number(config_1.default.bcrypt_salt_rounds));
    }
    const user = yield user_model_1.User.create(userData);
    return user;
});
exports.UserServices = {
    createUserIntoDB,
};

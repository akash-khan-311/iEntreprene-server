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
exports.User = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = require("mongoose");
const user_constant_1 = require("./user.constant");
const userSchema = new mongoose_1.Schema({
    name: {
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
    },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    country: { type: String, enum: user_constant_1.COUNTRY_LIST, required: true },
    gender: { type: String, enum: user_constant_1.GENDER, required: true },
    bloodGroup: { type: String, enum: user_constant_1.BLOOD_GROUP },
    designation: { type: String },
    role: { type: String, enum: user_constant_1.USER_ROLE, required: true },
    socialMedia: [{ name: String, link: String }],
    profileImg: { type: String },
    passwordChangedAt: { type: Date },
    status: {
        type: String,
        enum: user_constant_1.UserStatus,
        default: 'active',
        required: true,
    },
    isDeleted: { type: Boolean, default: false, required: true },
}, { timestamps: true });
// set '' after saving password
userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});
// Static methods
userSchema.statics.isUserExistsByEmail = function (email) {
    return __awaiter(this, void 0, void 0, function* () {
        return this.findOne({ email }).select('+password');
    });
};
userSchema.statics.isPasswordMatched = function (plainTextPassword, hashedPassword) {
    return __awaiter(this, void 0, void 0, function* () {
        return bcrypt_1.default.compare(plainTextPassword, hashedPassword);
    });
};
userSchema.statics.isJWTIssuedBeforePasswordChanged = function (passwordChangedTimestamp, jwtIssuedTimestamp) {
    if (!passwordChangedTimestamp)
        return false;
    const passwordChangedTime = new Date(passwordChangedTimestamp).getTime() / 1000;
    return passwordChangedTime > jwtIssuedTimestamp;
};
exports.User = (0, mongoose_1.model)('User', userSchema);

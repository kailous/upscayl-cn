"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
function decodePath(filePath) {
    return path_1.default.normalize(decodeURIComponent(filePath));
}
exports.default = decodePath;

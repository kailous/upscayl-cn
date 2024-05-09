"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_log_1 = __importDefault(require("electron-log"));
const commands_1 = __importDefault(require("../../common/commands"));
const main_window_1 = require("../main-window");
const logit = (...args) => {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    electron_log_1.default.log(...args);
    if (process.env.NODE_ENV === "development") {
        return;
    }
    mainWindow.webContents.send(commands_1.default.LOG, args.join(" "));
};
exports.default = logit;

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
const main_window_1 = require("../main-window");
const config_variables_1 = require("../utils/config-variables");
const logit_1 = __importDefault(require("../utils/logit"));
const stop = (event, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    (0, config_variables_1.setStopped)(true);
    mainWindow && mainWindow.setProgressBar(-1);
    config_variables_1.childProcesses.forEach((child) => {
        (0, logit_1.default)("🛑 Stopping Upscaling Process", child.process.pid);
        child.kill();
    });
});
exports.default = stop;

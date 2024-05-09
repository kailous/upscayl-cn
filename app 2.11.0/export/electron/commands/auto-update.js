"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const logit_1 = __importDefault(require("../utils/logit"));
const autoUpdate = (event) => {
    electron_updater_1.autoUpdater.autoInstallOnAppQuit = false;
    const dialogOpts = {
        type: "info",
        buttons: ["Install update", "No Thanks", "Check Release Notes"],
        title: "New Upscayl Update",
        message: event.releaseName,
        detail: "A new version has been downloaded. Restart the application to apply the updates.",
    };
    const dialogResponse = electron_1.dialog.showMessageBoxSync(dialogOpts);
    (0, logit_1.default)("✅ Update Downloaded");
    if (dialogResponse === 0) {
        electron_updater_1.autoUpdater.quitAndInstall();
    }
    else if (dialogResponse === 2) {
        electron_1.shell.openExternal("https://github.com/upscayl/upscayl/releases/tag/v" + event.version);
        electron_1.dialog.showMessageBoxSync(dialogOpts);
    }
    else {
        (0, logit_1.default)("🚫 Update Installation Cancelled");
    }
};
exports.default = autoUpdate;

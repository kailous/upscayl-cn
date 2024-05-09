"use strict";
/**
 * This file contains all the global local storage variables that need to be accessed on startup or during the app lifecycle. These are the variables that are not sent by the renderer process but are the localstorage variables used by the main process.
 * Our goal is to send as many variables as possible from the renderer process to the main process to avoid using local storage variables.
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fetchLocalStorage = exports.setChildProcesses = exports.setStopped = exports.setTurnOffNotifications = exports.turnOffNotifications = exports.childProcesses = exports.stopped = exports.setSavedCustomModelsPath = exports.savedCustomModelsPath = exports.setSavedBatchUpscaylFolderPath = exports.savedBatchUpscaylFolderPath = exports.setSavedImagePath = exports.savedImagePath = void 0;
const main_window_1 = require("../main-window");
const logit_1 = __importDefault(require("./logit"));
/**
 * The saved image path so that the select image dialog can open to the last used path.
 */
exports.savedImagePath = "";
function setSavedImagePath(value) {
    exports.savedImagePath = value;
    (0, logit_1.default)("🖼️ Updating Image Path: ", exports.savedImagePath);
}
exports.setSavedImagePath = setSavedImagePath;
/**
 * The saved folder path so that the select folder to upscayl dialog can open to the last used path.
 */
exports.savedBatchUpscaylFolderPath = undefined;
function setSavedBatchUpscaylFolderPath(value) {
    exports.savedBatchUpscaylFolderPath = value;
    (0, logit_1.default)("📁 Updating Folder Path: ", exports.savedBatchUpscaylFolderPath);
}
exports.setSavedBatchUpscaylFolderPath = setSavedBatchUpscaylFolderPath;
/**
 * The saved custom models folder path so that we can load the list of custom models from that folder on startup.
 */
exports.savedCustomModelsPath = undefined;
function setSavedCustomModelsPath(value) {
    exports.savedCustomModelsPath = value;
    (0, logit_1.default)("📁 Updating Custom Models Folder Path: ", exports.savedCustomModelsPath);
}
exports.setSavedCustomModelsPath = setSavedCustomModelsPath;
/**
 * The stopped variable to stop the batch upscayl process.
 */
exports.stopped = false;
/**
 * The child processes array to store the spawned upscayl processes.
 */
exports.childProcesses = [];
/**
 * The turn off notifications variable, so that we can load this value on startup.
 */
exports.turnOffNotifications = false;
function setTurnOffNotifications(value) {
    exports.turnOffNotifications = value;
    (0, logit_1.default)("🔕 Updating Turn Off Notifications: ", exports.turnOffNotifications);
}
exports.setTurnOffNotifications = setTurnOffNotifications;
// SETTERS
function setStopped(value) {
    exports.stopped = value;
    (0, logit_1.default)("🛑 Updating Stopped: ", exports.stopped);
}
exports.setStopped = setStopped;
function setChildProcesses(value) {
    exports.childProcesses.push(value);
    (0, logit_1.default)("👶 Updating Child Processes: ", JSON.stringify({
        binary: exports.childProcesses[0].process.spawnfile,
        args: exports.childProcesses[0].process.spawnargs,
    }));
}
exports.setChildProcesses = setChildProcesses;
// LOCAL STORAGE
function fetchLocalStorage() {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    // GET LAST IMAGE PATH TO LOCAL STORAGE
    mainWindow.webContents
        .executeJavaScript('localStorage.getItem("lastImagePath");', true)
        .then((lastImagePath) => {
        if (lastImagePath && lastImagePath.length > 0) {
            setSavedImagePath(lastImagePath);
        }
    });
    // GET LAST FOLDER PATH TO LOCAL STORAGE
    mainWindow.webContents
        .executeJavaScript('localStorage.getItem("lastSavedBatchUpscaylFolderPath");', true)
        .then((lastSavedBatchUpscaylFolderPath) => {
        if (lastSavedBatchUpscaylFolderPath &&
            lastSavedBatchUpscaylFolderPath.length > 0) {
            setSavedBatchUpscaylFolderPath(lastSavedBatchUpscaylFolderPath);
        }
    });
    // GET LAST CUSTOM MODELS FOLDER PATH TO LOCAL STORAGE
    mainWindow.webContents
        .executeJavaScript('localStorage.getItem("customModelsFolderPath");', true)
        .then((value) => {
        if (value && value.length > 0) {
            setSavedCustomModelsPath(value);
        }
    });
    // GET TURN OFF NOTIFICATIONS (BOOLEAN) FROM LOCAL STORAGE
    mainWindow.webContents
        .executeJavaScript('localStorage.getItem("turnOffNotifications");', true)
        .then((lastSaved) => {
        if (lastSaved !== null) {
            setTurnOffNotifications(lastSaved === "true");
        }
    });
}
exports.fetchLocalStorage = fetchLocalStorage;

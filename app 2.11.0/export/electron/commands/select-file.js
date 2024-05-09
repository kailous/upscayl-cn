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
const electron_1 = require("electron");
const main_window_1 = require("../main-window");
const config_variables_1 = require("../utils/config-variables");
const logit_1 = __importDefault(require("../utils/logit"));
const electron_settings_1 = __importDefault(require("electron-settings"));
const feature_flags_1 = require("../../common/feature-flags");
const selectFile = () => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    const { canceled, filePaths, bookmarks } = yield electron_1.dialog.showOpenDialog({
        properties: ["openFile"],
        title: "Select Image",
        defaultPath: config_variables_1.savedImagePath,
        securityScopedBookmarks: true,
        message: "Select Image to Upscale",
        filters: [
            {
                name: "Images",
                extensions: [
                    "png",
                    "jpg",
                    "jpeg",
                    "webp",
                    "PNG",
                    "JPG",
                    "JPEG",
                    "WEBP",
                ],
            },
        ],
    });
    if (feature_flags_1.featureFlags.APP_STORE_BUILD && bookmarks && bookmarks.length > 0) {
        console.log("🚨 Setting Bookmark: ", bookmarks);
        electron_settings_1.default.set("file-bookmarks", bookmarks[0]);
    }
    if (canceled) {
        (0, logit_1.default)("🚫 File Operation Cancelled");
        return null;
    }
    else {
        (0, config_variables_1.setSavedImagePath)(filePaths[0]);
        let isValid = false;
        // READ SELECTED FILES
        filePaths.forEach((file) => {
            // log.log("Files in Folder: ", file);
            if (file.endsWith(".png") ||
                file.endsWith(".jpg") ||
                file.endsWith(".jpeg") ||
                file.endsWith(".webp") ||
                file.endsWith(".JPG") ||
                file.endsWith(".PNG") ||
                file.endsWith(".JPEG") ||
                file.endsWith(".WEBP")) {
                isValid = true;
            }
        });
        if (!isValid) {
            (0, logit_1.default)("❌ Invalid File Detected");
            const options = {
                type: "error",
                title: "Invalid File",
                message: "The selected file is not a valid image. Make sure you select a '.png', '.jpg', or '.webp' file.",
            };
            if (!mainWindow)
                return null;
            electron_1.dialog.showMessageBoxSync(mainWindow, options);
            return null;
        }
        (0, logit_1.default)("📄 Selected File Path: ", filePaths[0]);
        // CREATE input AND upscaled FOLDER
        return filePaths[0];
    }
});
exports.default = selectFile;

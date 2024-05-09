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
const fs_1 = __importDefault(require("fs"));
const logit_1 = __importDefault(require("./logit"));
const electron_1 = require("electron");
const electron_settings_1 = __importDefault(require("electron-settings"));
const feature_flags_1 = require("../../common/feature-flags");
const getModels = (folderPath) => __awaiter(void 0, void 0, void 0, function* () {
    let models = [];
    let isValid = false;
    // SECURITY SCOPED BOOKMARKS
    let closeAccess;
    const customModelsBookmarks = yield electron_settings_1.default.get("custom-models-bookmarks");
    if (feature_flags_1.featureFlags.APP_STORE_BUILD && customModelsBookmarks) {
        console.log("🚀 => file: get-models.ts:18 => customModelsBookmarks:", customModelsBookmarks);
        try {
            closeAccess = electron_1.app.startAccessingSecurityScopedResource(customModelsBookmarks);
        }
        catch (error) {
            (0, logit_1.default)("📁 Custom Models Bookmarks Error: ", error);
        }
    }
    if (!folderPath) {
        (0, logit_1.default)("❌ Invalid Custom Model Folder Detected");
        const options = {
            type: "error",
            title: "Invalid Folder",
            message: "The selected folder does not contain valid model files. Make sure you select the folder that ONLY contains '.param' and '.bin' files.",
            buttons: ["OK"],
        };
        electron_1.dialog.showMessageBoxSync(options);
        return null;
    }
    // READ CUSTOM MODELS FOLDER
    fs_1.default.readdirSync(folderPath).forEach((file) => {
        // log.log("Files in Folder: ", file);
        if (file.endsWith(".param") ||
            file.endsWith(".PARAM") ||
            file.endsWith(".bin") ||
            file.endsWith(".BIN")) {
            isValid = true;
            const modelName = file.substring(0, file.lastIndexOf(".")) || file;
            if (!models.includes(modelName)) {
                models.push(modelName);
            }
        }
    });
    if (!isValid) {
        (0, logit_1.default)("❌ Invalid Custom Model Folder Detected");
        const options = {
            type: "error",
            title: "Invalid Folder",
            message: "The selected folder does not contain valid model files. Make sure you select the folder that ONLY contains '.param' and '.bin' files.",
            buttons: ["OK"],
        };
        electron_1.dialog.showMessageBoxSync(options);
        return null;
    }
    (0, logit_1.default)("🔎 Detected Custom Models: ", models);
    return models;
});
exports.default = getModels;

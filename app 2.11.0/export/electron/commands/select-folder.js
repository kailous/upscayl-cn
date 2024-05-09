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
const config_variables_1 = require("../utils/config-variables");
const logit_1 = __importDefault(require("../utils/logit"));
const electron_settings_1 = __importDefault(require("electron-settings"));
const feature_flags_1 = require("../../common/feature-flags");
const selectFolder = (event, message) => __awaiter(void 0, void 0, void 0, function* () {
    let closeAccess;
    const folderBookmarks = yield electron_settings_1.default.get("folder-bookmarks");
    if (feature_flags_1.featureFlags.APP_STORE_BUILD && folderBookmarks) {
        (0, logit_1.default)("🚨 Folder Bookmarks: ", folderBookmarks);
        try {
            closeAccess = electron_1.app.startAccessingSecurityScopedResource(folderBookmarks);
        }
        catch (error) {
            (0, logit_1.default)("📁 Folder Bookmarks Error: ", error);
        }
    }
    const { canceled, filePaths: folderPaths, bookmarks, } = yield electron_1.dialog.showOpenDialog({
        properties: ["openDirectory"],
        defaultPath: config_variables_1.savedBatchUpscaylFolderPath,
        securityScopedBookmarks: true,
    });
    if (feature_flags_1.featureFlags.APP_STORE_BUILD && bookmarks && bookmarks.length > 0) {
        console.log("🚨 Setting folder Bookmark: ", bookmarks);
        yield electron_settings_1.default.set("folder-bookmarks", bookmarks[0]);
    }
    if (canceled) {
        (0, logit_1.default)("🚫 Select Folder Operation Cancelled");
        return null;
    }
    else {
        (0, config_variables_1.setSavedBatchUpscaylFolderPath)(folderPaths[0]);
        (0, logit_1.default)("📁 Selected Folder Path: ", config_variables_1.savedBatchUpscaylFolderPath);
        return folderPaths[0];
    }
});
exports.default = selectFolder;

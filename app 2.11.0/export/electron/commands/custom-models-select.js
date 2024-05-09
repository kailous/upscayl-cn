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
const slash_1 = __importDefault(require("../utils/slash"));
const commands_1 = __importDefault(require("../../common/commands"));
const get_models_1 = __importDefault(require("../utils/get-models"));
const main_window_1 = require("../main-window");
const electron_settings_1 = __importDefault(require("electron-settings"));
const feature_flags_1 = require("../../common/feature-flags");
const customModelsSelect = (event, message) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    const { canceled, filePaths: folderPaths, bookmarks, } = yield electron_1.dialog.showOpenDialog({
        properties: ["openDirectory"],
        title: "Select Custom Models Folder",
        defaultPath: config_variables_1.savedCustomModelsPath,
        securityScopedBookmarks: true,
        message: "Select Custom Models Folder that is named 'models'",
    });
    if (feature_flags_1.featureFlags.APP_STORE_BUILD && bookmarks && bookmarks.length > 0) {
        console.log("🚨 Setting Bookmark: ", bookmarks);
        yield electron_settings_1.default.set("custom-models-bookmarks", bookmarks[0]);
    }
    if (canceled) {
        (0, logit_1.default)("🚫 Select Custom Models Folder Operation Cancelled");
        return null;
    }
    else {
        (0, config_variables_1.setSavedCustomModelsPath)(folderPaths[0]);
        if (!folderPaths[0].endsWith(slash_1.default + "models") &&
            !folderPaths[0].endsWith(slash_1.default + "models" + slash_1.default)) {
            (0, logit_1.default)("❌ Invalid Custom Models Folder Detected: Not a 'models' folder");
            const options = {
                type: "error",
                title: "Invalid Folder",
                message: "Please make sure that the folder name is 'models' and nothing else.",
                buttons: ["OK"],
            };
            electron_1.dialog.showMessageBoxSync(options);
            return null;
        }
        const models = yield (0, get_models_1.default)(config_variables_1.savedCustomModelsPath);
        mainWindow.webContents.send(commands_1.default.CUSTOM_MODEL_FILES_LIST, models);
        (0, logit_1.default)("📁 Custom Folder Path: ", config_variables_1.savedCustomModelsPath);
        return config_variables_1.savedCustomModelsPath;
    }
});
exports.default = customModelsSelect;

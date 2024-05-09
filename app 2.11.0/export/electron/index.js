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
const electron_next_1 = __importDefault(require("electron-next"));
const electron_updater_1 = require("electron-updater");
const electron_log_1 = __importDefault(require("electron-log"));
const electron_1 = require("electron");
const commands_1 = __importDefault(require("../common/commands"));
const logit_1 = __importDefault(require("./utils/logit"));
const open_folder_1 = __importDefault(require("./commands/open-folder"));
const stop_1 = __importDefault(require("./commands/stop"));
const select_folder_1 = __importDefault(require("./commands/select-folder"));
const select_file_1 = __importDefault(require("./commands/select-file"));
const get_models_list_1 = __importDefault(require("./commands/get-models-list"));
const custom_models_select_1 = __importDefault(require("./commands/custom-models-select"));
const image_upscayl_1 = __importDefault(require("./commands/image-upscayl"));
const main_window_1 = require("./main-window");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const get_resource_paths_1 = require("./utils/get-resource-paths");
const batch_upscayl_1 = __importDefault(require("./commands/batch-upscayl"));
const double_upscayl_1 = __importDefault(require("./commands/double-upscayl"));
const auto_update_1 = __importDefault(require("./commands/auto-update"));
const feature_flags_1 = require("../common/feature-flags");
const electron_settings_1 = __importDefault(require("electron-settings"));
// INITIALIZATION
electron_log_1.default.initialize({ preload: true });
(0, logit_1.default)("🚃 App Path: ", electron_1.app.getAppPath());
electron_1.app.on("ready", () => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, electron_next_1.default)("./renderer");
    electron_1.app.whenReady().then(() => {
        electron_1.protocol.registerFileProtocol("file", (request, callback) => {
            const pathname = decodeURI(request.url.replace("file:///", ""));
            callback(pathname);
        });
    });
    (0, main_window_1.createMainWindow)();
    if (!electron_is_dev_1.default) {
        electron_updater_1.autoUpdater.checkForUpdates();
    }
    electron_log_1.default.info("🚀 UPSCAYL EXEC PATH: ", get_resource_paths_1.execPath);
    electron_log_1.default.info("🚀 MODELS PATH: ", get_resource_paths_1.modelsPath);
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
}));
// Quit the app once all windows are closed
electron_1.app.on("window-all-closed", () => {
    electron_1.app.quit();
});
// ! ENABLE THIS FOR MACOS APP STORE BUILD
if (feature_flags_1.featureFlags.APP_STORE_BUILD) {
    (0, logit_1.default)("🚀 APP STORE BUILD ENABLED");
    electron_1.app.commandLine.appendSwitch("in-process-gpu");
}
electron_1.ipcMain.on(commands_1.default.STOP, stop_1.default);
electron_1.ipcMain.on(commands_1.default.OPEN_FOLDER, open_folder_1.default);
electron_1.ipcMain.handle(commands_1.default.SELECT_FOLDER, select_folder_1.default);
electron_1.ipcMain.handle(commands_1.default.SELECT_FILE, select_file_1.default);
electron_1.ipcMain.on(commands_1.default.GET_MODELS_LIST, get_models_list_1.default);
electron_1.ipcMain.handle(commands_1.default.SELECT_CUSTOM_MODEL_FOLDER, custom_models_select_1.default);
electron_1.ipcMain.on(commands_1.default.UPSCAYL, image_upscayl_1.default);
electron_1.ipcMain.on(commands_1.default.FOLDER_UPSCAYL, batch_upscayl_1.default);
electron_1.ipcMain.on(commands_1.default.DOUBLE_UPSCAYL, double_upscayl_1.default);
if (!feature_flags_1.featureFlags.APP_STORE_BUILD) {
    electron_updater_1.autoUpdater.on("update-downloaded", auto_update_1.default);
}

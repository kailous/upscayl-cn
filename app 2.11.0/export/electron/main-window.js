"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMainWindow = exports.createMainWindow = void 0;
const electron_1 = require("electron");
const get_device_specs_1 = require("./utils/get-device-specs");
const path_1 = require("path");
const commands_1 = __importDefault(require("../common/commands"));
const config_variables_1 = require("./utils/config-variables");
const electron_is_dev_1 = __importDefault(require("electron-is-dev"));
const url_1 = require("url");
let mainWindow;
const createMainWindow = () => {
    console.log("📂 DIRNAME", __dirname);
    mainWindow = new electron_1.BrowserWindow({
        icon: (0, path_1.join)(__dirname, "build", "icon.png"),
        width: 1300,
        height: 940,
        minHeight: 500,
        minWidth: 600,
        show: false,
        backgroundColor: "#171717",
        webPreferences: {
            nodeIntegration: true,
            nodeIntegrationInWorker: true,
            webSecurity: false,
            preload: (0, path_1.join)(__dirname, "preload.js"),
        },
        titleBarStyle: (0, get_device_specs_1.getPlatform)() === "mac" ? "hiddenInset" : "default",
    });
    const url = electron_is_dev_1.default
        ? "http://localhost:8000"
        : (0, url_1.format)({
            pathname: (0, path_1.join)(__dirname, "../../renderer/out/index.html"),
            protocol: "file:",
            slashes: true,
        });
    mainWindow.loadURL(url);
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        electron_1.shell.openExternal(url);
        return { action: "deny" };
    });
    mainWindow.once("ready-to-show", () => {
        if (!mainWindow)
            return;
        mainWindow.show();
    });
    (0, config_variables_1.fetchLocalStorage)();
    mainWindow.webContents.send(commands_1.default.OS, (0, get_device_specs_1.getPlatform)());
    mainWindow.setMenuBarVisibility(false);
};
exports.createMainWindow = createMainWindow;
const getMainWindow = () => {
    return mainWindow;
};
exports.getMainWindow = getMainWindow;

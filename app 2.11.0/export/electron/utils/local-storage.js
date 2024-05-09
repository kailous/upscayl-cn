"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.localStorage = void 0;
const main_window_1 = require("../main-window");
/**
 * @description LocalStorage wrapper for the main window
 * @example
 * import { settings } from "./utils/settings";
 *
 * // Get a value
 * const value = settings.get("key", true);
 *
 * // Set a value
 * settings.set("key", value);
 */
exports.localStorage = {
    get: (key, parse = false) => {
        const mainWindow = (0, main_window_1.getMainWindow)();
        if (!mainWindow)
            return null;
        let result = null;
        mainWindow.webContents
            .executeJavaScript(`localStorage.getItem("${key}");`, true)
            .then((localStorageValue) => {
            if (localStorageValue) {
                result = parse ? JSON.parse(localStorageValue) : localStorageValue;
            }
        });
        return result;
    },
    set: (key, value) => {
        const mainWindow = (0, main_window_1.getMainWindow)();
        if (!mainWindow)
            return;
        mainWindow.webContents.executeJavaScript(`localStorage.setItem("${key}", ${JSON.stringify(value)});`, true);
    },
};

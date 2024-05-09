"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("electron/main");
const config_variables_1 = require("./config-variables");
function showNotification(title, body) {
    if (config_variables_1.turnOffNotifications)
        return;
    new main_1.Notification({
        title,
        body,
        closeButtonText: "Close",
    }).show();
}
exports.default = showNotification;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getArch = exports.getPlatform = void 0;
const os_1 = require("os");
const getPlatform = () => {
    switch ((0, os_1.platform)()) {
        case "aix":
        case "freebsd":
        case "linux":
        case "openbsd":
        case "android":
            return "linux";
        case "darwin":
        case "sunos":
            return "mac";
        case "win32":
            return "win";
    }
};
exports.getPlatform = getPlatform;
const getArch = () => {
    switch ((0, os_1.arch)()) {
        case "x64":
            return "x64";
        case "x32":
            return "x86";
        case "arm":
            return "arm";
        case "arm64":
            return "arm64";
    }
};
exports.getArch = getArch;

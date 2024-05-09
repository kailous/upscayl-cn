"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getFilenameFromPath(path) {
    if (!path)
        return "";
    const separator = path.includes("/") ? "/" : "\\";
    return path.split(separator).slice(-1)[0];
}
exports.default = getFilenameFromPath;

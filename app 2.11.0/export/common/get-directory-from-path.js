"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function getDirectoryFromPath(filePath) {
    // Define the path separator based on the operating system
    const separator = filePath.includes("/") ? "/" : "\\";
    // Split the file path by the path separator
    const pathParts = filePath.split(separator);
    // Remove the last element to get the directory
    pathParts.pop();
    // Join the remaining parts back together to form the directory path
    const directoryPath = pathParts.join(separator);
    return directoryPath || "";
}
exports.default = getDirectoryFromPath;

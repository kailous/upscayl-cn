"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Returns the filename without the extension.
 * @param filename The filename to remove the extension from.
 * @returns The filename without the extension.
 */
function removeFileExtension(filename) {
    return filename.replace(/\.[^/.]+$/, "");
}
exports.default = removeFileExtension;

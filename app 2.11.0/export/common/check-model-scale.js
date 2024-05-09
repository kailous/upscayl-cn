"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Get the scale of the model based on the model name
 * @param model The model name
 * @returns The initial scale of the model
 */
function getModelScale(model) {
    const modelName = model.toLowerCase();
    let initialScale = "4";
    if (modelName.includes("x2") || modelName.includes("2x")) {
        initialScale = "2";
    }
    else if (modelName.includes("x3") || modelName.includes("3x")) {
        initialScale = "3";
    }
    else {
        initialScale = "4";
    }
    return initialScale;
}
exports.default = getModelScale;

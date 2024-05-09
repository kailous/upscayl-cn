"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.spawnUpscayl = void 0;
const child_process_1 = require("child_process");
const get_resource_paths_1 = require("./get-resource-paths");
const spawnUpscayl = (command, logit) => {
    logit("📢 Upscayl Command: ", command.filter((arg) => arg !== ""));
    const spawnedProcess = (0, child_process_1.spawn)(get_resource_paths_1.execPath, command.filter((arg) => arg !== ""), {
        cwd: undefined,
        detached: false,
    });
    return {
        process: spawnedProcess,
        kill: () => spawnedProcess.kill(),
    };
};
exports.spawnUpscayl = spawnUpscayl;

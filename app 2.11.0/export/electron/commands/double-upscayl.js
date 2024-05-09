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
const path_1 = require("path");
const main_window_1 = require("../main-window");
const config_variables_1 = require("../utils/config-variables");
const slash_1 = __importDefault(require("../utils/slash"));
const spawn_upscayl_1 = require("../utils/spawn-upscayl");
const get_arguments_1 = require("../utils/get-arguments");
const get_resource_paths_1 = require("../utils/get-resource-paths");
const logit_1 = __importDefault(require("../utils/logit"));
const commands_1 = __importDefault(require("../../common/commands"));
const show_notification_1 = __importDefault(require("../utils/show-notification"));
const models_list_1 = require("../../common/models-list");
const get_file_name_1 = __importDefault(require("../../common/get-file-name"));
const decode_path_1 = __importDefault(require("../../common/decode-path"));
const get_directory_from_path_1 = __importDefault(require("../../common/get-directory-from-path"));
const doubleUpscayl = (event, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    const tileSize = payload.tileSize;
    const compression = payload.compression;
    const scale = parseInt(payload.scale) ** 2;
    const useCustomWidth = payload.useCustomWidth;
    const customWidth = useCustomWidth ? payload.customWidth : "";
    const model = payload.model;
    const gpuId = payload.gpuId;
    const saveImageAs = payload.saveImageAs;
    const imagePath = (0, decode_path_1.default)(payload.imagePath);
    let inputDir = (0, get_directory_from_path_1.default)(imagePath);
    let outputDir = (0, decode_path_1.default)(payload.outputPath);
    const fullfileName = (0, get_file_name_1.default)(imagePath);
    const fileName = (0, path_1.parse)(fullfileName).name;
    const isDefaultModel = models_list_1.DEFAULT_MODELS.includes(model);
    // COPY IMAGE TO TMP FOLDER
    const outFile = outputDir +
        slash_1.default +
        fileName +
        "_upscayl_" +
        (useCustomWidth ? `${customWidth}px_` : `${scale}x_`) +
        model +
        "." +
        saveImageAs;
    // UPSCALE
    let upscayl = (0, spawn_upscayl_1.spawnUpscayl)((0, get_arguments_1.getDoubleUpscaleArguments)({
        inputDir,
        fullfileName: decodeURIComponent(fullfileName),
        outFile,
        modelsPath: isDefaultModel
            ? get_resource_paths_1.modelsPath
            : config_variables_1.savedCustomModelsPath !== null && config_variables_1.savedCustomModelsPath !== void 0 ? config_variables_1.savedCustomModelsPath : get_resource_paths_1.modelsPath,
        model,
        gpuId,
        saveImageAs,
        tileSize,
    }), logit_1.default);
    let upscayl2;
    config_variables_1.childProcesses.push(upscayl);
    (0, config_variables_1.setStopped)(false);
    let failed = false;
    let failed2 = false;
    // SECOND PASS FUNCTIONS
    const onError2 = (data) => {
        if (!mainWindow)
            return;
        data.toString();
        // SEND UPSCAYL PROGRESS TO RENDERER
        mainWindow.webContents.send(commands_1.default.DOUBLE_UPSCAYL_PROGRESS, data);
        // SET FAILED TO TRUE
        failed2 = true;
        mainWindow &&
            mainWindow.webContents.send(commands_1.default.UPSCAYL_ERROR, "Error upscaling image. Error: " + data);
        (0, show_notification_1.default)("Upscayl Failure", "Failed to upscale image!");
        upscayl2.kill();
        return;
    };
    const onData2 = (data) => {
        if (!mainWindow)
            return;
        // CONVERT DATA TO STRING
        data = data.toString();
        // SEND UPSCAYL PROGRESS TO RENDERER
        mainWindow.webContents.send(commands_1.default.DOUBLE_UPSCAYL_PROGRESS, data);
        // IF PROGRESS HAS ERROR, UPSCAYL FAILED
        if (data.includes("Error")) {
            upscayl2.kill();
            failed2 = true;
        }
        else if (data.includes("Resizing")) {
            mainWindow.webContents.send(commands_1.default.SCALING_AND_CONVERTING);
        }
    };
    const onClose2 = (code) => __awaiter(void 0, void 0, void 0, function* () {
        if (!mainWindow)
            return;
        if (!failed2 && !config_variables_1.stopped) {
            (0, logit_1.default)("💯 Done upscaling");
            mainWindow.setProgressBar(-1);
            mainWindow.webContents.send(commands_1.default.DOUBLE_UPSCAYL_DONE, outFile);
            (0, show_notification_1.default)("Upscayled", "Image upscayled successfully!");
        }
    });
    // FIRST PASS FUNCTIONS
    const onError = (data) => {
        if (!mainWindow)
            return;
        mainWindow.setProgressBar(-1);
        data.toString();
        // SEND UPSCAYL PROGRESS TO RENDERER
        mainWindow.webContents.send(commands_1.default.DOUBLE_UPSCAYL_PROGRESS, data);
        // SET FAILED TO TRUE
        failed = true;
        mainWindow &&
            mainWindow.webContents.send(commands_1.default.UPSCAYL_ERROR, "Error upscaling image. Error: " + data);
        (0, show_notification_1.default)("Upscayl Failure", "Failed to upscale image!");
        upscayl.kill();
        return;
    };
    const onData = (data) => {
        if (!mainWindow)
            return;
        // CONVERT DATA TO STRING
        data = data.toString();
        // SEND UPSCAYL PROGRESS TO RENDERER
        mainWindow.webContents.send(commands_1.default.DOUBLE_UPSCAYL_PROGRESS, data);
        // IF PROGRESS HAS ERROR, UPSCAYL FAILED
        if (data.includes("Error") || data.includes("failed")) {
            upscayl.kill();
            failed = true;
        }
        else if (data.includes("Resizing")) {
            mainWindow.webContents.send(commands_1.default.SCALING_AND_CONVERTING);
        }
    };
    const onClose = (code) => {
        // IF NOT FAILED
        if (!failed && !config_variables_1.stopped) {
            // SPAWN A SECOND PASS
            upscayl2 = (0, spawn_upscayl_1.spawnUpscayl)((0, get_arguments_1.getDoubleUpscaleSecondPassArguments)({
                outFile,
                modelsPath: isDefaultModel
                    ? get_resource_paths_1.modelsPath
                    : config_variables_1.savedCustomModelsPath !== null && config_variables_1.savedCustomModelsPath !== void 0 ? config_variables_1.savedCustomModelsPath : get_resource_paths_1.modelsPath,
                model,
                gpuId,
                saveImageAs,
                scale: scale.toString(),
                customWidth,
                compression,
                tileSize,
            }), logit_1.default);
            (0, logit_1.default)("🚀 Upscaling Second Pass");
            config_variables_1.childProcesses.push(upscayl2);
            upscayl2.process.stderr.on("data", onData2);
            upscayl2.process.on("error", onError2);
            upscayl2.process.on("close", onClose2);
        }
    };
    upscayl.process.stderr.on("data", onData);
    upscayl.process.on("error", onError);
    upscayl.process.on("close", onClose);
});
exports.default = doubleUpscayl;

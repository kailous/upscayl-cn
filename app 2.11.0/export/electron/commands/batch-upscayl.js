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
const fs_1 = __importDefault(require("fs"));
const main_window_1 = require("../main-window");
const config_variables_1 = require("../utils/config-variables");
const logit_1 = __importDefault(require("../utils/logit"));
const spawn_upscayl_1 = require("../utils/spawn-upscayl");
const get_arguments_1 = require("../utils/get-arguments");
const slash_1 = __importDefault(require("../utils/slash"));
const get_resource_paths_1 = require("../utils/get-resource-paths");
const commands_1 = __importDefault(require("../../common/commands"));
const show_notification_1 = __importDefault(require("../utils/show-notification"));
const models_list_1 = require("../../common/models-list");
const batchUpscayl = (event, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    const tileSize = payload.tileSize;
    const compression = payload.compression;
    const scale = payload.scale;
    const useCustomWidth = payload.useCustomWidth;
    const customWidth = useCustomWidth ? payload.customWidth : "";
    const model = payload.model;
    const gpuId = payload.gpuId;
    const saveImageAs = payload.saveImageAs;
    // GET THE IMAGE DIRECTORY
    let inputDir = decodeURIComponent(payload.batchFolderPath);
    // GET THE OUTPUT DIRECTORY
    let outputFolderPath = decodeURIComponent(payload.outputPath);
    const outputFolderName = `upscayl_${saveImageAs}_${model}_${useCustomWidth ? `${customWidth}px` : `${scale}x`}`;
    outputFolderPath += slash_1.default + outputFolderName;
    // CREATE THE OUTPUT DIRECTORY
    if (!fs_1.default.existsSync(outputFolderPath)) {
        fs_1.default.mkdirSync(outputFolderPath, { recursive: true });
    }
    const isDefaultModel = models_list_1.DEFAULT_MODELS.includes(model);
    // UPSCALE
    const upscayl = (0, spawn_upscayl_1.spawnUpscayl)((0, get_arguments_1.getBatchArguments)({
        inputDir,
        outputDir: outputFolderPath,
        modelsPath: isDefaultModel
            ? get_resource_paths_1.modelsPath
            : config_variables_1.savedCustomModelsPath !== null && config_variables_1.savedCustomModelsPath !== void 0 ? config_variables_1.savedCustomModelsPath : get_resource_paths_1.modelsPath,
        model,
        gpuId,
        saveImageAs,
        scale,
        customWidth,
        compression,
        tileSize,
    }), logit_1.default);
    config_variables_1.childProcesses.push(upscayl);
    (0, config_variables_1.setStopped)(false);
    let failed = false;
    let encounteredError = false;
    const onData = (data) => {
        if (!mainWindow)
            return;
        data = data.toString();
        mainWindow.webContents.send(commands_1.default.FOLDER_UPSCAYL_PROGRESS, data.toString());
        if (data.includes("Error")) {
            (0, logit_1.default)("❌ ", data);
            encounteredError = true;
        }
        else if (data.includes("Resizing")) {
            mainWindow.webContents.send(commands_1.default.SCALING_AND_CONVERTING);
        }
    };
    const onError = (data) => {
        if (!mainWindow)
            return;
        mainWindow.setProgressBar(-1);
        mainWindow.webContents.send(commands_1.default.FOLDER_UPSCAYL_PROGRESS, data.toString());
        failed = true;
        upscayl.kill();
        mainWindow &&
            mainWindow.webContents.send(commands_1.default.UPSCAYL_ERROR, `Error upscaling images! ${data}`);
        return;
    };
    const onClose = () => {
        if (!mainWindow)
            return;
        if (!failed && !config_variables_1.stopped) {
            (0, logit_1.default)("💯 Done upscaling");
            upscayl.kill();
            mainWindow.webContents.send(commands_1.default.FOLDER_UPSCAYL_DONE, outputFolderPath);
            if (!encounteredError) {
                (0, show_notification_1.default)("Upscayled", "Images upscayled successfully!");
            }
            else {
                (0, show_notification_1.default)("Upscayled", "Images were upscayled but encountered some errors!");
            }
        }
        else {
            upscayl.kill();
        }
    };
    upscayl.process.stderr.on("data", onData);
    upscayl.process.on("error", onError);
    upscayl.process.on("close", onClose);
});
exports.default = batchUpscayl;

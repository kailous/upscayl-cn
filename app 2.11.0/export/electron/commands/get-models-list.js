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
const commands_1 = __importDefault(require("../../common/commands"));
const main_window_1 = require("../main-window");
const config_variables_1 = require("../utils/config-variables");
const get_models_1 = __importDefault(require("../utils/get-models"));
const logit_1 = __importDefault(require("../utils/logit"));
const getModelsList = (event, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const mainWindow = (0, main_window_1.getMainWindow)();
    if (!mainWindow)
        return;
    if (payload) {
        (0, config_variables_1.setSavedCustomModelsPath)(payload);
        (0, logit_1.default)("📁 Custom Models Folder Path: ", config_variables_1.savedCustomModelsPath);
        const models = yield (0, get_models_1.default)(payload);
        mainWindow.webContents.send(commands_1.default.CUSTOM_MODEL_FILES_LIST, models);
    }
});
exports.default = getModelsList;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const get_device_specs_1 = require("./get-device-specs");
const slash = (0, get_device_specs_1.getPlatform)() === "win" ? "\\" : "/";
exports.default = slash;

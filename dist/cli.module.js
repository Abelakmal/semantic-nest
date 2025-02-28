"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CliModule = void 0;
const common_1 = require("@nestjs/common");
const generate_module_command_1 = require("./commands/generate-module.command");
const generate_common_command_1 = require("./commands/generate-common.command");
/* eslint-disable @typescript-eslint/no-extraneous-class */
let CliModule = class CliModule {
};
CliModule = __decorate([
    (0, common_1.Module)({
        providers: [generate_module_command_1.GenerateModuleCommand, generate_common_command_1.GenerateCommonCommand],
    })
], CliModule);
exports.CliModule = CliModule;

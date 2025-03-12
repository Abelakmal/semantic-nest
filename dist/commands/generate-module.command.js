"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenerateModuleCommand = void 0;
const nest_commander_1 = require("nest-commander");
const fs_1 = require("fs");
const path = require("path");
const contoller_template_1 = require("../templates/module/contoller.template");
const module_template_1 = require("../templates/module/module.template");
const service_template_1 = require("../templates/module/service.template");
const repository_template_1 = require("../templates/module/repository.template");
const entities_template_1 = require("../templates/module/entities.template");
const create_dto_template_1 = require("../templates/module/create-dto.template");
const update_dto_template_1 = require("../templates/module/update-dto.template");
const response_template_1 = require("../templates/module/response.template");
const filtering_template_1 = require("../templates/module/filtering.template");
const interface_tempalate_1 = require("../templates/module/interface.tempalate");
const text_format_helper_1 = require("../helpers/text-format.helper");
let GenerateModuleCommand = class GenerateModuleCommand extends nest_commander_1.CommandRunner {
    run(passedParams, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const moduleName = (_b = (_a = this.moduleName) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.name) !== null && _b !== void 0 ? _b : passedParams[0];
            if (!moduleName) {
                console.error("❌ Module name is required! Use: generate:module <name>");
                return;
            }
            const className = (0, text_format_helper_1.toCamelCase)((0, text_format_helper_1.capitalize)(moduleName));
            const folderName = moduleName.toLowerCase();
            const modulePath = path.join(process.cwd(), "src", "modules", folderName);
            try {
                yield this.createModuleStructure(modulePath, folderName, className);
                yield this.updateAppModule(className, folderName);
                console.log(`✅ Module ${folderName} created successfully!`);
            }
            catch (error) {
                console.error("❌ Error generating module:", error);
            }
        });
    }
    setModuleName(value) {
        this.moduleName = value;
    }
    createModuleStructure(modulePath, folderName, className) {
        return __awaiter(this, void 0, void 0, function* () {
            const entitiesDir = path.join(modulePath, "entities");
            yield fs_1.promises.mkdir(entitiesDir, { recursive: true });
            const dtoDir = path.join(modulePath, "dto");
            yield fs_1.promises.mkdir(dtoDir, { recursive: true });
            const interfacesDir = path.join(modulePath, "interfaces");
            yield fs_1.promises.mkdir(interfacesDir, { recursive: true });
            const files = {
                [`dto/create-${folderName}.dto.ts`]: (0, create_dto_template_1.generateCreateDtoContent)(className),
                [`dto/update-${folderName}.dto.ts`]: (0, update_dto_template_1.generateUpdateDtoContent)(className, folderName),
                [`dto/filtering-${folderName}.dto.ts`]: (0, filtering_template_1.generateFilteringContent)(className),
                [`dto/response-${folderName}.dto.ts`]: (0, response_template_1.generateResponseDtoContent)(className),
                [`${folderName}.module.ts`]: (0, module_template_1.generateModuleContent)(className, folderName),
                [`${folderName}.controller.ts`]: (0, contoller_template_1.generateControllerContent)(className, folderName),
                [`${folderName}.service.ts`]: (0, service_template_1.generateServiceContent)(className, folderName),
                [`${folderName}.repository.ts`]: (0, repository_template_1.generateRepositoryContent)(className, folderName),
                [`entities/${folderName}.entity.ts`]: (0, entities_template_1.generateEntityContent)(className, folderName),
                [`interfaces/${folderName}.interface.ts`]: (0, interface_tempalate_1.generateInterfaceContent)(className),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
        });
    }
    updateAppModule(className, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const appModulePath = path.join(process.cwd(), "src", "app.module.ts");
            try {
                const appModuleContent = yield fs_1.promises.readFile(appModulePath, "utf-8");
                if (appModuleContent.includes(`${className}Module`)) {
                    console.log(`⚠️ ${className}Module is already imported in app.module.ts`);
                    return;
                }
                const importStatement = `import { ${className}Module } from './modules/${folderName}/${folderName}.module';\n`;
                const moduleRegex = /(imports:\s*\[)([^]*?)(\s*\])/;
                const updatedContent = appModuleContent.replace(moduleRegex, (match, start, modules, end) => {
                    const trimmedModules = modules.trim();
                    const needsComma = trimmedModules.length > 0 ? ',' : '';
                    return `${start}${modules}${needsComma}\n    ${className}Module${end}`;
                });
                yield fs_1.promises.writeFile(appModulePath, importStatement + updatedContent);
                console.log(`✅ ${className}Module has been added to app.module.ts`);
            }
            catch (error) {
                console.error("❌ Error updating app.module.ts:", error);
            }
        });
    }
};
__decorate([
    (0, nest_commander_1.Option)({ flags: "-n, --name <name>", description: "Module name" }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], GenerateModuleCommand.prototype, "setModuleName", null);
GenerateModuleCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: "generate:module",
        description: "Generate a NestJS module, dto, controller, service , entities and repository",
    })
], GenerateModuleCommand);
exports.GenerateModuleCommand = GenerateModuleCommand;

"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
exports.GenerateCommonCommand = void 0;
const nest_commander_1 = require("nest-commander");
const fs_1 = require("fs");
const path = require("path");
const base_entity_template_1 = require("../templates/common/bases/base-entity.template");
const base_repository_template_1 = require("../templates/common/bases/base-repository.template");
const base_response_template_1 = require("../templates/common/bases/base-response.template");
const base_service_template_1 = require("../templates/common/bases/base-service.template");
const base_validation_template_1 = require("../templates/common/bases/base-validation.template");
const metadata_decorator_template_1 = require("../templates/common/decorators/metadata-decorator.template");
const query_paramater_dto_template_1 = require("../templates/common/dto/query-paramater-dto.template");
const pagination_dto_template_1 = require("../templates/common/dto/pagination-dto.template");
const swagger_example_response_template_1 = require("../templates/common/swagger/swagger-example-response.template");
const global_interface_template_1 = require("../templates/common/interfaces/global-interface.template");
const jwt_interface_template_1 = require("../templates/common/interfaces/jwt-interface.template");
const base_exception_template_1 = require("../templates/common/bases/exceptions/base-exception.template");
const bad_request_exception_template_1 = require("../templates/common/bases/exceptions/customs/bad-request-exception.template");
const conflict_exception_template_1 = require("../templates/common/bases/exceptions/customs/conflict-exception.template");
const forbiden_exception_tempalate_1 = require("../templates/common/bases/exceptions/customs/forbiden-exception.tempalate");
const not_found_exception_template_1 = require("../templates/common/bases/exceptions/customs/not-found-exception.template");
const to_many_request_exception_template_1 = require("../templates/common/bases/exceptions/customs/to-many-request-exception.template");
const unauthorized_exception_template_1 = require("../templates/common/bases/exceptions/customs/unauthorized-exception.template");
const unsupport_exception_template_1 = require("../templates/common/bases/exceptions/customs/unsupport-exception.template");
const path_paramater_dto_template_1 = require("../templates/common/dto/path-paramater-dto.template");
let GenerateCommonCommand = class GenerateCommonCommand extends nest_commander_1.CommandRunner {
    run(passedParams, options) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const orm = (_b = (_a = this.OrmName) !== null && _a !== void 0 ? _a : options === null || options === void 0 ? void 0 : options.name) !== null && _b !== void 0 ? _b : passedParams[0];
            if (!orm) {
                console.error("❌ Orm name is required! Use: generate:common <name> ");
                return;
            }
            const modulePath = path.join(process.cwd(), "src", "common");
            try {
                yield this.createCommandStructure(modulePath);
                yield this.updateAppModule();
                yield this.updateMainTs();
                console.log(`✅  created common successfully!`);
            }
            catch (error) {
                console.error("❌ Error generating common:", error);
                (0, base_entity_template_1.generateBaseEntityContent)();
            }
        });
    }
    createCommandStructure(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtoDir = path.join(modulePath, "dto");
            yield fs_1.promises.mkdir(dtoDir, { recursive: true });
            const swaggerDir = path.join(modulePath, "swagger");
            yield fs_1.promises.mkdir(swaggerDir, { recursive: true });
            yield this.handleBaseStructure(modulePath);
            yield this.handleDecorator(modulePath);
            yield this.handleDto(modulePath);
            yield this.handleSwagger(modulePath);
            yield this.handleInterface(modulePath);
        });
    }
    handleBaseStructure(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const basesDir = path.join(modulePath, "bases");
            yield fs_1.promises.mkdir(basesDir, { recursive: true });
            const files = {
                ["bases/base.entity.ts"]: (0, base_entity_template_1.generateBaseEntityContent)(),
                ["bases/base.repository.ts"]: (0, base_repository_template_1.generateBaseRepositoryContent)(),
                ["bases/base.response.ts"]: (0, base_response_template_1.generateBaseResponseContent)(),
                ["bases/base.service.ts"]: (0, base_service_template_1.generateBaseServiceContent)(),
                ["bases/base.validation.ts"]: (0, base_validation_template_1.generateBaseValidationContent)(),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
            yield this.handleException(basesDir);
        });
    }
    handleException(basePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const exceptionDir = path.join(basePath, "exceptions");
            yield fs_1.promises.mkdir(exceptionDir, { recursive: true });
            const templateExceptionDir = path.join(exceptionDir, "templates");
            yield fs_1.promises.mkdir(templateExceptionDir, { recursive: true });
            const fileExceptionBase = {
                ["exceptions/base.exception.ts"]: (0, base_exception_template_1.generateBaseExceptionContent)(),
            };
            const fileExceptionTemplate = {
                ["templates/bad-request.exception.ts"]: (0, bad_request_exception_template_1.generateBadRequstExceptionContent)(),
                ["templates/conflict.exception.ts"]: (0, conflict_exception_template_1.generateConflictExceptionContent)(),
                ["templates/forbiden.exception.ts"]: (0, forbiden_exception_tempalate_1.generateForbidenExceptionContent)(),
                ["templates/not-found.exception.ts"]: (0, not_found_exception_template_1.generateNotFoundExceptionContent)(),
                ["templates/to-many-request.exception.ts"]: (0, to_many_request_exception_template_1.generateToManyRequestExceptionContent)(),
                ["templates/unauthorized.exception.ts"]: (0, unauthorized_exception_template_1.generateUnauthorizedContent)(),
                ["templates/unsuport-media-type.exception.ts"]: (0, unsupport_exception_template_1.generateUnsupportExceptionContent)(),
            };
            for (const [fileName, content] of Object.entries(fileExceptionBase)) {
                yield fs_1.promises.writeFile(path.join(basePath, fileName), content);
            }
            for (const [fileName, content] of Object.entries(fileExceptionTemplate)) {
                yield fs_1.promises.writeFile(path.join(exceptionDir, fileName), content);
            }
        });
    }
    handleDecorator(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const decoratorDir = path.join(modulePath, "decorators");
            yield fs_1.promises.mkdir(decoratorDir, { recursive: true });
            const files = {
                ["decorators/metadata.decorator.ts"]: (0, metadata_decorator_template_1.generateMetadataDecoratorContent)(),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
        });
    }
    handleDto(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const dtoDir = path.join(modulePath, "dto");
            yield fs_1.promises.mkdir(dtoDir, { recursive: true });
            const files = {
                ["dto/query-parameter.dto.ts"]: (0, query_paramater_dto_template_1.generateQueryParamaterDtoContent)(),
                ["dto/path-paramater.dto.ts"]: (0, path_paramater_dto_template_1.geenratePathParamaterDtoContent)(),
                ["dto/pagination.dto.ts"]: (0, pagination_dto_template_1.generatePaginationDtoContent)(),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
        });
    }
    handleSwagger(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const swaggerDir = path.join(modulePath, "swagger");
            yield fs_1.promises.mkdir(swaggerDir, { recursive: true });
            const files = {
                ["swagger/swagger-example.response.ts"]: (0, swagger_example_response_template_1.generateSwaggerExampleResponseContent)(),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
        });
    }
    handleInterface(modulePath) {
        return __awaiter(this, void 0, void 0, function* () {
            const interfaceDir = path.join(modulePath, "interfaces");
            yield fs_1.promises.mkdir(interfaceDir, { recursive: true });
            const files = {
                ["interfaces/global.d.ts"]: (0, global_interface_template_1.generateGlobalInterfaceContent)(),
                ["interfaces/jwt-payload.interface.ts"]: (0, jwt_interface_template_1.generateJwtInterfaceContent)(),
            };
            for (const [fileName, content] of Object.entries(files)) {
                yield fs_1.promises.writeFile(path.join(modulePath, fileName), content);
            }
        });
    }
    updateAppModule() {
        return __awaiter(this, void 0, void 0, function* () {
            const appModulePath = path.join(process.cwd(), "src", "app.module.ts");
            try {
                const appModuleContent = yield fs_1.promises.readFile(appModulePath, "utf-8");
                const importStatement = `import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { BaseValidationPipe } from './common/bases/base.validation';
import { AllExceptionFilter } from './common/bases/exceptions/base.exception';\n\n`;
                const updatedContent = appModuleContent.replace(/(providers:\s*\[[^\]]*)(\s*\])/, `$1,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_PIPE, useClass: BaseValidationPipe }$2`);
                yield fs_1.promises.writeFile(appModulePath, importStatement + updatedContent, "utf-8");
            }
            catch (error) {
                console.error("❌ Error updating app.module.ts:", error);
            }
        });
    }
    updateMainTs() {
        return __awaiter(this, void 0, void 0, function* () {
            const mainTsPath = path.join("src", "main.ts");
            let mainTsContent = yield fs_1.promises.readFile(mainTsPath, "utf-8");
            if (mainTsContent.includes("app.useGlobalPipes")) {
                console.log("⚠️ Konfigurasi global pipes sudah ada di main.ts");
                return;
            }
            const configCode = `
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    );
  
    app.setGlobalPrefix('api');
  
    const config = new DocumentBuilder()
      .setTitle('Project Name')
      .setDescription('Ini dekripsi')
      .setVersion('1.0.0')
      .addBearerAuth()
      .build();
  
    const document = SwaggerModule.createDocument(app, config);
  
    SwaggerModule.setup('docs', app, document, {
      useGlobalPrefix: true,
      customSiteTitle: 'E-Wawancara',
    });
    `;
            const importStatement = `import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';\n`;
            mainTsContent = mainTsContent.replace(/(await app.listen\(\d+\);)/, `${configCode}\n  $1`);
            yield fs_1.promises.writeFile(mainTsPath, importStatement + mainTsContent, "utf-8");
            console.log("✅ Konfigurasi berhasil ditambahkan ke main.ts");
        });
    }
};
GenerateCommonCommand = __decorate([
    (0, nest_commander_1.Command)({
        name: "generate:common",
        description: "Generate a NestJS common bases, decorator, dto and swagger",
    })
], GenerateCommonCommand);
exports.GenerateCommonCommand = GenerateCommonCommand;

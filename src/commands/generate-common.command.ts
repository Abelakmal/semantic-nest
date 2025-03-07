import { Command, CommandRunner } from "nest-commander";
import { promises as fs } from "fs";
import * as path from "path";
import { generateBaseEntityContent } from "../templates/common/bases/base-entity.template";
import { generateBaseRepositoryContent } from "../templates/common/bases/base-repository.template";
import { generateBaseResponseContent } from "../templates/common/bases/base-response.template";
import { generateBaseServiceContent } from "../templates/common/bases/base-service.template";
import { generateBaseValidationContent } from "../templates/common/bases/base-validation.template";
import { generateMetadataDecoratorContent } from "../templates/common/decorators/metadata-decorator.template";
import { generateQueryParamaterDtoContent } from "../templates/common/dto/query-paramater-dto.template";
import { generatePaginationDtoContent } from "../templates/common/dto/pagination-dto.template";
import { FileMapType } from "../interfaces/general.type";
import { generateSwaggerExampleResponseContent } from "../templates/common/swagger/swagger-example-response.template";
import { generateGlobalInterfaceContent } from "../templates/common/interfaces/global-interface.template";
import { generateJwtInterfaceContent } from "../templates/common/interfaces/jwt-interface.template";
import { generateBaseExceptionContent } from "../templates/common/bases/exceptions/base-exception.template";
import { generateBadRequstExceptionContent } from "../templates/common/bases/exceptions/customs/bad-request-exception.template";
import { generateConflictExceptionContent } from "../templates/common/bases/exceptions/customs/conflict-exception.template";
import { generateForbidenExceptionContent } from "../templates/common/bases/exceptions/customs/forbiden-exception.tempalate";
import { generateNotFoundExceptionContent } from "../templates/common/bases/exceptions/customs/not-found-exception.template";
import { generateToManyRequestExceptionContent } from "../templates/common/bases/exceptions/customs/to-many-request-exception.template";
import { generateUnauthorizedContent } from "../templates/common/bases/exceptions/customs/unauthorized-exception.template";
import { generateUnsupportExceptionContent } from "../templates/common/bases/exceptions/customs/unsupport-exception.template";
import { geenratePathParamaterDtoContent } from "../templates/common/dto/path-paramater-dto.template";

@Command({
  name: "generate:common",
  description: "Generate a NestJS common bases, decorator, dto and swagger",
})
export class GenerateCommonCommand extends CommandRunner {
  private OrmName?: string;
  async run(passedParams: string[], options?: { name?: string }) {
    const orm: string | null = this.OrmName ?? options?.name ?? passedParams[0];
    if (!orm) {
      console.error("❌ Orm name is required! Use: generate:common <name> ");
      return;
    }

    const modulePath: string = path.join(process.cwd(), "src", "common");

    try {
      await this.createCommandStructure(modulePath);
      await this.updateAppModule();
      await this.updateMainTs();
      console.log(`✅  created common successfully!`);
    } catch (error) {
      console.error("❌ Error generating common:", error);
      generateBaseEntityContent();
    }
  }

  private async createCommandStructure(modulePath: string): Promise<void> {
    const dtoDir: string = path.join(modulePath, "dto");
    await fs.mkdir(dtoDir, { recursive: true });

    const swaggerDir: string = path.join(modulePath, "swagger");
    await fs.mkdir(swaggerDir, { recursive: true });

    await this.handleBaseStructure(modulePath);
    await this.handleDecorator(modulePath);
    await this.handleDto(modulePath);
    await this.handleSwagger(modulePath);
    await this.handleInterface(modulePath);
  }

  private async handleBaseStructure(modulePath: string): Promise<void> {
    const basesDir = path.join(modulePath, "bases");
    await fs.mkdir(basesDir, { recursive: true });

    const files = {
      ["bases/base.entity.ts"]: generateBaseEntityContent(),
      ["bases/base.repository.ts"]: generateBaseRepositoryContent(),
      ["bases/base.response.ts"]: generateBaseResponseContent(),
      ["bases/base.service.ts"]: generateBaseServiceContent(),
      ["bases/base.validation.ts"]: generateBaseValidationContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }

    await this.handleException(basesDir);
  }

  private async handleException(basePath: string) {
    const exceptionDir = path.join(basePath, "exceptions");
    await fs.mkdir(exceptionDir, { recursive: true });
    const templateExceptionDir = path.join(exceptionDir, "templates");
    await fs.mkdir(templateExceptionDir, { recursive: true });

    const fileExceptionBase = {
      ["exceptions/base.exception.ts"]: generateBaseExceptionContent(),
    };

    const fileExceptionTemplate = {
      ["templates/bad-request.exception.ts"]:
        generateBadRequstExceptionContent(),
      ["templates/conflict.exception.ts"]: generateConflictExceptionContent(),
      ["templates/forbiden.exception.ts"]: generateForbidenExceptionContent(),
      ["templates/not-found.exception.ts"]: generateNotFoundExceptionContent(),
      ["templates/to-many-request.exception.ts"]:
        generateToManyRequestExceptionContent(),
      ["templates/unauthorized.exception.ts"]: generateUnauthorizedContent(),
      ["templates/unsuport-media-type.exception.ts"]:
        generateUnsupportExceptionContent(),
    };

    for (const [fileName, content] of Object.entries(fileExceptionBase)) {
      await fs.writeFile(path.join(basePath, fileName), content);
    }

    for (const [fileName, content] of Object.entries(fileExceptionTemplate)) {
      await fs.writeFile(path.join(exceptionDir, fileName), content);
    }
  }

  private async handleDecorator(modulePath: string): Promise<void> {
    const decoratorDir: string = path.join(modulePath, "decorators");
    await fs.mkdir(decoratorDir, { recursive: true });

    const files: FileMapType = {
      ["decorators/metadata.decorator.ts"]: generateMetadataDecoratorContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  private async handleDto(modulePath: string): Promise<void> {
    const dtoDir: string = path.join(modulePath, "dto");
    await fs.mkdir(dtoDir, { recursive: true });

    const files: FileMapType = {
      ["dto/query-parameter.dto.ts"]: generateQueryParamaterDtoContent(),
      ["dto/path-paramater.dto.ts"]: geenratePathParamaterDtoContent(),
      ["dto/pagination.dto.ts"]: generatePaginationDtoContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  private async handleSwagger(modulePath: string): Promise<void> {
    const swaggerDir: string = path.join(modulePath, "swagger");
    await fs.mkdir(swaggerDir, { recursive: true });

    const files: FileMapType = {
      ["swagger/swagger-example.response.ts"]:
        generateSwaggerExampleResponseContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  private async handleInterface(modulePath: string): Promise<void> {
    const interfaceDir: string = path.join(modulePath, "interfaces");
    await fs.mkdir(interfaceDir, { recursive: true });

    const files: FileMapType = {
      ["interfaces/global.d.ts"]: generateGlobalInterfaceContent(),
      ["interfaces/jwt-payload.interface.ts"]: generateJwtInterfaceContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  private async updateAppModule() {
    const appModulePath = path.join(process.cwd(), "src", "app.module.ts");
    try {
      const appModuleContent = await fs.readFile(appModulePath, "utf-8");

      const importStatement = `import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { BaseValidationPipe } from './common/bases/base.validation';
import { AllExceptionFilter } from './common/bases/exceptions/base.exception';\n\n`;

      const updatedContent = appModuleContent.replace(
        /(providers:\s*\[[^\]]*)(\s*\])/,
        `$1,
    { provide: APP_FILTER, useClass: AllExceptionFilter },
    { provide: APP_PIPE, useClass: BaseValidationPipe }$2`
      );

      await fs.writeFile(
        appModulePath,
        importStatement + updatedContent,
        "utf-8"
      );
    } catch (error) {
      console.error("❌ Error updating app.module.ts:", error);
    }
  }

  async updateMainTs() {
    const mainTsPath = path.join("src", "main.ts");
    let mainTsContent = await fs.readFile(mainTsPath, "utf-8");

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

    mainTsContent = mainTsContent.replace(
      /(await app.listen\(\d+\);)/,
      `${configCode}\n  $1`
    );

    await fs.writeFile(mainTsPath, importStatement + mainTsContent, "utf-8");

    console.log("✅ Konfigurasi berhasil ditambahkan ke main.ts");
  }
}

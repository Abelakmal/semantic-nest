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
      //   await this.updateAppModule(className, folderName);
      console.log(`✅  created common successfully!`);
    } catch (error) {
      console.error("❌ Error generating common:", error);
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
  }

  public async handleBaseStructure(modulePath: string): Promise<void> {
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
  }

  public async handleDecorator(modulePath: string): Promise<void> {
    const decoratorDir: string = path.join(modulePath, "decorators");
    await fs.mkdir(decoratorDir, { recursive: true });

    const files: FileMapType = {
      ["decorators/metadata.decorator.ts"]: generateMetadataDecoratorContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  public async handleDto(modulePath: string): Promise<void> {
    const dtoDir: string = path.join(modulePath, "dto");
    await fs.mkdir(dtoDir, { recursive: true });

    const files: FileMapType = {
      ["dto/query-parameter.dto.ts"]: generateQueryParamaterDtoContent(),
      ["dto/pagination.dto.ts"]: generatePaginationDtoContent(),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  public async handleSwagger(modulePath: string): Promise<void> {
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
}

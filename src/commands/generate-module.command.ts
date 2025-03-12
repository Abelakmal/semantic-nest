import { Command, Option, CommandRunner } from "nest-commander";
import { promises as fs } from "fs";
import * as path from "path";
import { generateControllerContent } from "../templates/module/contoller.template";
import { generateModuleContent } from "../templates/module/module.template";
import { generateServiceContent } from "../templates/module/service.template";
import { generateRepositoryContent } from "../templates/module/repository.template";
import { generateEntityContent } from "../templates/module/entities.template";
import { generateCreateDtoContent } from "../templates/module/create-dto.template";
import { generateUpdateDtoContent } from "../templates/module/update-dto.template";
import { generateResponseDtoContent } from "../templates/module/response.template";
import { generateFilteringContent } from "../templates/module/filtering.template";
import { generateInterfaceContent } from "../templates/module/interface.tempalate";
import { capitalize, toCamelCase } from "../helpers/text-format.helper";

@Command({
  name: "generate:module",
  description:
    "Generate a NestJS module, dto, controller, service , entities and repository",
})
export class GenerateModuleCommand extends CommandRunner {
  private moduleName?: string;

  async run(passedParams: string[], options?: { name?: string }) {
    const moduleName = this.moduleName ?? options?.name ?? passedParams[0];
    if (!moduleName) {
      console.error("❌ Module name is required! Use: generate:module <name>");
      return;
    }

    const className = toCamelCase(capitalize(moduleName));
    const folderName = moduleName.toLowerCase();
    const modulePath = path.join(process.cwd(), "src", "modules", folderName);

    try {
      await this.createModuleStructure(modulePath, folderName, className);
      await this.updateAppModule(className, folderName);
      console.log(`✅ Module ${folderName} created successfully!`);
    } catch (error) {
      console.error("❌ Error generating module:", error);
    }
  }

  @Option({ flags: "-n, --name <name>", description: "Module name" })
  setModuleName(value: string) {
    this.moduleName = value;
  }

  private async createModuleStructure(
    modulePath: string,
    folderName: string,
    className: string
  ) {
    const entitiesDir = path.join(modulePath, "entities");
    await fs.mkdir(entitiesDir, { recursive: true });

    const dtoDir = path.join(modulePath, "dto");
    await fs.mkdir(dtoDir, { recursive: true });

    const interfacesDir = path.join(modulePath, "interfaces");
    await fs.mkdir(interfacesDir, { recursive: true });

    const files = {
      [`dto/create-${folderName}.dto.ts`]: generateCreateDtoContent(className),
      [`dto/update-${folderName}.dto.ts`]: generateUpdateDtoContent(
        className,
        folderName
      ),
      [`dto/filtering-${folderName}.dto.ts`]:
        generateFilteringContent(className),
      [`dto/response-${folderName}.dto.ts`]:
        generateResponseDtoContent(className),
      [`${folderName}.module.ts`]: generateModuleContent(className, folderName),
      [`${folderName}.controller.ts`]: generateControllerContent(
        className,
        folderName
      ),
      [`${folderName}.service.ts`]: generateServiceContent(
        className,
        folderName
      ),
      [`${folderName}.repository.ts`]: generateRepositoryContent(
        className,
        folderName
      ),
      [`entities/${folderName}.entity.ts`]: generateEntityContent(
        className,
        folderName
      ),
      [`interfaces/${folderName}.interface.ts`]:
        generateInterfaceContent(className),
    };

    for (const [fileName, content] of Object.entries(files)) {
      await fs.writeFile(path.join(modulePath, fileName), content);
    }
  }

  private async updateAppModule(className: string, folderName: string) {
    const appModulePath = path.join(process.cwd(), "src", "app.module.ts");

    try {
      const appModuleContent = await fs.readFile(appModulePath, "utf-8");
      if (appModuleContent.includes(`${className}Module`)) {
        console.log(
          `⚠️ ${className}Module is already imported in app.module.ts`
        );
        return;
      }

      const importStatement = `import { ${className}Module } from './modules/${folderName}/${folderName}.module';\n`;
      const moduleRegex = /(imports:\s*\[)([^]*?)(\s*\])/;

      const updatedContent = appModuleContent.replace(moduleRegex, (match, start, modules, end) => {
        const trimmedModules = modules.trim();
        
        const needsComma = trimmedModules.length > 0 ? ',' : '';

        return `${start}${modules}${needsComma}\n    ${className}Module${end}`;
      });

      await fs.writeFile(appModulePath, importStatement + updatedContent);
      console.log(`✅ ${className}Module has been added to app.module.ts`);
    } catch (error) {
      console.error("❌ Error updating app.module.ts:", error);
    }
  }
}

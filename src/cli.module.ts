import { Module } from "@nestjs/common";
import { GenerateModuleCommand } from "./commands/generate-module.command";
import { GenerateCommonCommand } from "./commands/generate-common.command";

/* eslint-disable @typescript-eslint/no-extraneous-class */
@Module({
  providers: [GenerateModuleCommand, GenerateCommonCommand],
})
export class CliModule {}

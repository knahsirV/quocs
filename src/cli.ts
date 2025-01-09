import { Command } from "commander";
import { parseRepository } from "./repoParser";
import { generateDocs } from "./docsGenerator";
import { createInterface } from "readline";
import fs from "fs";

const program = new Command();

// default command when no arguments are provided
program
  .name("quocs")
  .description("CLI to quickly generate docs using LLM")
  .version("0.1.0")
  .action(() => {
    console.log(`
📚 Quocs - AI-Powered Documentation Generator

Available commands:
  init    Generate initial documentation for your project
  update  Update existing documentation
  help    Show detailed help and usage information

To get started:
  $ npx quocs init

To see detailed help:
  $ npx quocs help
    `);
  });

// init
program
  .command("init")
  .description("Create initial documentation for the repository")
  .action(async () => {
    try {
      const files = await parseRepository(process.cwd());
      await generateDocs(files);
      console.log("Documentation generated successfully!");
    } catch (error) {
      console.error("Error generating documentation:", error);
    }
  });

// update
program
  .command("update")
  .description("Update existing documentation")
  .action(async () => {
    try {
      const files = await parseRepository(process.cwd());
      await generateDocs(files, true);
      console.log("Documentation updated successfully!");
    } catch (error) {
      console.error("Error updating documentation:", error);
    }
  });

// help
program
  .command("help")
  .description("Provide a list of available commands and usage examples")
  .action(() => {
    console.log(`
🚀 Quocs - Quick Documentation Generator

Description:
  Quocs is a CLI tool that uses AI to automatically generate and maintain documentation
  for your Svelte projects (or any JavaScript/TypeScript project).

Commands:
  init    Create initial documentation for your repository
         Usage: quocs init

  update  Update existing documentation while preserving structure
         Usage: quocs update

  help    Show this help message
         Usage: quocs help

Examples:
  # Generate initial documentation
  $ quocs init

  # Update existing documentation
  $ quocs update

Configuration:
  1. Create a .env file in your project root
  2. Add your HuggingFace API token:
     HUGGINGFACE_API_TOKEN=your_token_here

Generated Documentation Structure:
  docs/
  ├── index.md          # Main documentation index
  └── [component].md    # Individual component/file documentation

Notes:
  - Documentation is generated in Markdown format
  - The 'update' command preserves existing documentation structure
  - Generated docs can be used with documentation sites like VitePress or MDsveX
  - Add 'docs/' to .gitignore if you don't want to version control the generated docs

For more information, visit: https://github.com/yourusername/quocs
    `);
  });

program.parse();

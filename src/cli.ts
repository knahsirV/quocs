import { Command } from "commander";

const program = new Command();

// default
program
  .name("quocs")
  .description("CLI to quickly generate docs")
  .version("0.1.0")
  .action(() => {
    console.log("default");
  });

// init
program
  .command("init")
  .description("Create a new /docs folder with markup files")
  .action(() => {
    console.log("init");
  });

// update
program
  .command("update")
  .description("Create a new /docs folder with markup files")
  .action(() => {
    console.log("update");
  });

// help
program
  .command("help")
  .description("Provide a list of available commands")
  .action(() => {
    console.log("help");
  });

program.parse();

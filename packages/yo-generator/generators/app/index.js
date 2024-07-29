/* eslint-disable @typescript-eslint/no-var-requires */
"use strict";
const Generator = require("yeoman-generator");
const chalk = require("chalk");
const yosay = require("yosay");

module.exports = class extends Generator {
  constructor(args, opts) {
    super(args, opts);
    this.description =
      "Generates a Tokens Studio Graph Engine ready for development.";
  }

  prompting() {
    // Have Yeoman greet the user.
    this.log(
      yosay(
        `Welcome to the  ${chalk.red("generator-graph-engine")} generator!`,
      ),
    );
    const prompts = [];

    return this.prompt(prompts).then((props) => {
      // To access props later use this.props.someAnswer;
      this.props = props;
    });
  }

  writing() {
    this.fs.copy(
      this.templatePath(".tsgraphrc"),
      this.destinationPath(".tsgraphrc"),
    );
    this.fs.copy(
      this.templatePath("user.json"),
      this.destinationPath("user.json"),
    );
    this.fs.copy(
      this.templatePath("vite.config.ts"),
      this.destinationPath("vite.config.ts"),
    );
    this.fs.copy(
      this.templatePath("tsconfig.json"),
      this.destinationPath("tsconfig.json"),
    );
    this.fs.copy(
      this.templatePath("package.json"),
      this.destinationPath("package.json"),
    );
    this.fs.copy(
      this.templatePath("readme.md"),
      this.destinationPath("readme.md"),
    );

    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("assets/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("capabilities/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("editor/controls/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("editor/icons/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("editor/nodes/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("editor/previews/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("graphs/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("nodes/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitkeep"),
      this.destinationPath("schemas/.gitkeep"),
    );
    this.fs.copy(
      this.templatePath(".gitignore.txt"),
      this.destinationPath(".gitignore"),
    );
  }

  install() {
    this.installDependencies();
  }
};

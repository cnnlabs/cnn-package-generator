# CNN Package Generator

A command line tool for generating package templates that will comply with the
CNN coding styles and practices.

This package is in very early stages and has very limited uses right now.


## Requirements

A current LTS or Stable version of [Node.js](https://nodejs.org).  We recommend
using [nvm](https://github.com/creationix/nvm#readme) to manage node versions.

The [TravisCI](./.travis.yml) configuration file details the node versions that
are currently tested.


## Install

```shell
$ npm install --global cnn-package-generator
```


## Usage

```
$ cnn --help
Usage: cnn [OPTIONS] generators
  -h, --help       Show this information
  -v, --version    Show version information

  Available generators:
    cli
```


## Valid generators

- `cli` - Use when creating a cli tool.


## What does this do?

- Generates a default file structure for the chosen generator.

- Generates configuration files with predefined settings based on our
  current standards.  This includes settings for the following packages.

  - [Editorconfig](http://editorconfig.org/)
  - [ESDoc](https://esdoc.org/)
  - [ESLint](http://eslint.org/)
  - [npm](https://www.npmjs.com/)
  - [nvm](https://github.com/creationix/nvm)

- Generates our standardized process documents.

  - AUTHORS.md
  - CHANGELOG.md
  - COLLABORATOR_GUIDE.md
  - CONTRIBUTING.md
  - GOVERNANCE.md

- Creates a local GIT repository for the project.  Currently the remote
  repository on GitHub will need to be manually created.

- Generates a default package.json with all of the required properties and
  dependencies needed for the chosen generator.  Includes the following default
  scripts.

  - `generate-authors` - Uses a bash script to generate the AUTHORS.md file,
    which is used by npmjs.org when your package is published.

  - `generate-changelog` - Uses [changelog-maker](https://github.com/rvagg/changelog-maker)
    to generate the CHANGELOG.md.

  - `generate-docs` - Uses [ESDoc](https://esdoc.org/) to generate documentation
    in `/docs`.

  - `generate-manpage` - Uses [marked-man](https://github.com/kapouer/marked-man)
    to create man pages.  Only applies to the cli generator.

  - `test` - Uses [ESLint](http://eslint.org/) to validate all .js files and
    uses [jsonlint](https://github.com/zaach/jsonlint) to validates all .json
    files.

  - `update-apply` - Uses [ncu](https://github.com/tjunnone/npm-check-updates)
    and updates all dependencies.

  - `update-check` - Uses [ncu](https://github.com/tjunnone/npm-check-updates)
    and lists all updates, but does not apply them.

- Calls `npm-init` to further customize the package.json file.



[![build](https://img.shields.io/travis/cnnlabs/cnn-package-generator/master.svg?style=flat-square)](https://travis-ci.org/cnnlabs/cnn-package-generator)
![node](https://img.shields.io/node/v/cnn-hapi.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/cnn-package-generator.svg?style=flat-square)](https://www.npmjs.com/package/cnn-package-generator)
[![npm-downloads](https://img.shields.io/npm/dm/cnn-package-generator.svg?style=flat-square)](https://www.npmjs.com/package/cnn-package-generator)
[![dependency-status](https://gemnasium.com/cnnlabs/cnn-package-generator.svg)](https://gemnasium.com/cnnlabs/cnn-package-generator)

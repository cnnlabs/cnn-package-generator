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
```


## Available generators

Your system will be scanned and any generators found will be listed.  If a
generator you want to use is not listed you can install it directly from npm.
In future versions of this cli, this will be done automatically.




[![build](https://img.shields.io/travis/cnnlabs/cnn-package-generator/master.svg?style=flat-square)](https://travis-ci.org/cnnlabs/cnn-package-generator)
![node](https://img.shields.io/node/v/cnn-package-generator.svg?style=flat-square)
[![npm](https://img.shields.io/npm/v/cnn-package-generator.svg?style=flat-square)](https://www.npmjs.com/package/cnn-package-generator)
[![npm-downloads](https://img.shields.io/npm/dm/cnn-package-generator.svg?style=flat-square)](https://www.npmjs.com/package/cnn-package-generator)
[![dependency-status](https://gemnasium.com/cnnlabs/cnn-package-generator.svg)](https://gemnasium.com/cnnlabs/cnn-package-generator)

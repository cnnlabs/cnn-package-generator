'use strict';

const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    writing: function () {
        this.fs.copy(this.templatePath('.editorconfig'), this.destinationPath('.editorconfig'));
        this.fs.copy(this.templatePath('.esdoc.json'), this.destinationPath('.esdoc.json'));
        this.fs.copy(this.templatePath('.eslintignore'), this.destinationPath('.eslintignore'));
        this.fs.copy(this.templatePath('.eslintrc'), this.destinationPath('.eslintrc'));
        this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
        this.fs.copy(this.templatePath('_npmrc'), this.destinationPath('.npmrc'));
        this.fs.copy(this.templatePath('.nvmrc'), this.destinationPath('.nvmrc'));

        this.fs.copy(this.templatePath('AUTHORS.md'), this.destinationPath('AUTHORS.md'));
        this.fs.copy(this.templatePath('CHANGELOG.md'), this.destinationPath('CHANGELOG.md'));
        this.fs.copy(this.templatePath('COLLABORATOR_GUIDE.md'), this.destinationPath('COLLABORATOR_GUIDE.md'));
        this.fs.copy(this.templatePath('CONTRIBUTING.md'), this.destinationPath('CONTRIBUTING.md'));
        this.fs.copy(this.templatePath('GOVERNANCE.md'), this.destinationPath('GOVERNANCE.md'));
        this.fs.copy(this.templatePath('README.md'), this.destinationPath('README.md'));

        this.fs.copy(this.templatePath('package.json'), this.destinationPath('package.json'));
    },

    installModules: function () {
        this.npmInstall([
            'changelog-maker',
            'esdoc',
            'eslint',
            'jq-cli-wrapper',
            'jsonlint',
            'npm-check-updates'
        ], {
            saveDev: true
        });
    }
});

'use strict';

const generators = require('yeoman-generator');


/**
 * Validates that a string is a valid POSIX.1-2013 3.92 character string.
 *
 * @see http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_92
 *
 * @param {?string} input
 * The string to validate.
 *
 * @return {boolean|string}
 * Will either be true, or a string.  If it is a string, validation failed.
 */
function validateCharacterString(input) {
    return (input.length > 0) ? true : 'Must be a valid POSIX.1-2013 3.92 Character String!';
}


/**
 * Validates that a string is a valid POSIX.1-2013 3.170 filename.
 *
 * @see http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap03.html#tag_03_170
 *
 * @param {?string} input
 * The string to validate.
 *
 * @return {boolean|string}
 * Will either be true, or a string.  If it is a string, validation failed.
 */
function validateFilename(input) {
    let isValidCharacterString = validateCharacterString(input);

    if (isValidCharacterString !== true) {
        return isValidCharacterString;
    }

    return (input.search(/ /) === -1) ? true : 'Must be a valid POSIX.1-2013 3.170 Filename!';
}


/**
 * Validates that a string is a valid repositry name for CNN projects.  All CNN
 * projects must start with `cnn-`.
 *
 * @param {?string} input
 * The string to validate.
 *
 * @return {boolean|string}
 * Will either be true, or a string.  If it is a string, validation failed.
 */
function validateRepositoryName(input) {
    let isValidFilename = validateFilename(input);

    if (isValidFilename !== true) {
        return isValidFilename;
    }

    return (input.search(/^cnn-/) !== -1) ? true : 'Repository names must start with `cnn-`';
}


function validateRemoteRepository(input) {
    return /^https:\/\/github.com\/cnnlabs\/.+\.git$/.test(input) ? true : 'Use the https clone url from the repository that was created.';
}


module.exports = generators.Base.extend({
    initializing: {},

    prompting: {
        prompt: function () {
            let done = this.async();

            this.prompt(
                [
                    {
                        type: 'input',
                        name: 'repositoryName',
                        message: 'Repository name:',
                        default: process.cwd().match(/[^\/]+$/)[0],
                        validate: validateRepositoryName
                    },
                    {
                        type: 'input',
                        name: 'githubRepositoryUrl',
                        message: 'GitHub repository in the cnnlabs organzation url',
                        validate: validateRemoteRepository
                    },
                    {
                        type: 'input',
                        name: 'cliName',
                        message: 'CLI name:',
                        validate: validateFilename

                    },
                    {
                        type: 'input',
                        name: 'projectName',
                        message: 'Project name:',
                        validate: validateCharacterString

                    },
                    {
                        type: 'list',
                        name: 'minimumNodeVersion',
                        message: 'Minimum node version:',
                        default: '5.6.0',
                        choices: [
                            '4.3.0',
                            '5.6.0'
                        ]
                    },
                    {
                        type: 'input',
                        name: 'gitEmail',
                        message: 'Git email:',
                        default: this.user.git.email(),
                        validate: validateCharacterString

                    },
                    {
                        type: 'input',
                        name: 'gitName',
                        message: 'Git name:',
                        default: this.user.git.name(),
                        validate: validateCharacterString
                    }
                ],

                function (answers) {
                    this.cliName = answers.cliName;
                    // this.githubRepositoryUrl = answers.githubRepositoryUrl;
                    this.minimumNodeVersion = answers.minimumNodeVersion;
                    this.projectName = answers.projectName;
                    this.repositoryName = answers.repositoryName;
                    this.gitName = answers.gitName;
                    this.gitEmail = answers.gitEmail;

                    done();
                }.bind(this)
            );
        }
    },

    configuring: {
        models: function () {
            this.userModel = {
                gitName: this.gitName,
                gitEmail: this.gitEmail
            },

            this.templateModel = {
                CLI_NAME: this.cliName,
                MINIMUM_NODE_VERSION: this.minimumNodeVersion,
                PROJECT_NAME: this.projectName,
                REPOSITORY_NAME: this.repositoryName
            };
        }
    },

    default: {},

    writing: {
        copyFiles: function () {
            // Each file in the root direction needs to be explicitly set due to
            // the dot files needing to be renamed.  Anything in folders can be
            // bulk copied.
            this.fs.copy(this.templatePath('.npm-init.js'), this.destinationPath('.npm-init.js'));
            this.fs.copy(this.templatePath('_editorconfig'), this.destinationPath('.editorconfig'));
            this.fs.copy(this.templatePath('_eslintignore'), this.destinationPath('.eslintignore'));
            this.fs.copy(this.templatePath('_eslintrc'), this.destinationPath('.eslintrc'));
            this.fs.copy(this.templatePath('_gitignore'), this.destinationPath('.gitignore'));
            this.fs.copy(this.templatePath('_npmrc'), this.destinationPath('.npmrc'));

            this.fs.copy(this.templatePath('AUTHORS.md'), this.destinationPath('AUTHORS.md'));
            this.fs.copy(this.templatePath('COLLABORATOR_GUIDE.md'), this.destinationPath('COLLABORATOR_GUIDE.md'));
            this.fs.copy(this.templatePath('CONTRIBUTING.md'), this.destinationPath('CONTRIBUTING.md'));
            this.fs.copy(this.templatePath('GOVERNANCE.md'), this.destinationPath('GOVERNANCE.md'));
            this.fs.copy(this.templatePath('LICENSE'), this.destinationPath('LICENSE'));

            this.fs.copy(this.templatePath('man/man1/.gitkeep'), this.destinationPath(`man/man1/${this.cliName}.1`));
            this.fs.copy(this.templatePath('test/'), this.destinationPath('test/'));
            this.fs.copy(this.templatePath('tools/'), this.destinationPath('tools/'));
        },

        copyTemplates: function () {
            this.fs.copyTpl(this.templatePath('_esdoc.json'), this.destinationPath('.esdoc.json'), this.templateModel);
            this.fs.copyTpl(this.templatePath('_nvmrc'), this.destinationPath('.nvmrc'), this.templateModel);
            this.fs.copyTpl(this.templatePath('CHANGELOG.md'), this.destinationPath('CHANGELOG.md'), this.templateModel);
            this.fs.copyTpl(this.templatePath('lib/cli.js'), this.destinationPath(`lib/${this.cliName}-cli.js`), this.templateModel);
            this.fs.copyTpl(this.templatePath('package.json'), this.destinationPath('package.json'), this.templateModel);
            this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), this.templateModel);
            this.fs.copyTpl(this.templatePath('src/man/man1/cli.1.md'), this.destinationPath(`src/man/man1/${this.cliName}.1.md`), this.templateModel);
        },

        createRepository: function () {
            this.spawnCommandSync('git', ['init']);

            if (this.gitName !== this.user.git.name()) {
                this.spawnCommandSync('git', ['config', '--local', 'user.name', this.gitName]);
            }

            if (this.gitEmail !== this.user.git.email()) {
                this.spawnCommandSync('git', ['config', '--local', 'user.email', this.gitEmail]);
            }
        }
    },

    conflicts: {},

    install: {
        npmInit: function () {
            this.spawnCommandSync('npm', ['init']);
        },

        npmInstall: function () {
            this.npmInstall(['minimist'], {save: true});

            this.npmInstall([
                'changelog-maker',
                'esdoc',
                'eslint',
                'marked-man',
                'jq-cli-wrapper',
                'jsonlint',
                'npm-check-updates'
            ], {
                saveDev: true
            });
        }
    },

    end: {
        generateManpage: function () {
            this.spawnCommandSync('npm', ['run', 'generate-manpage']);
        }
    }
});

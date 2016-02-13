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


module.exports = generators.Base.extend({
    prompting: {
        prompt: function () {
            let done = this.async();

            this.prompt(
                [
                    {
                        type: 'input',
                        name: 'cliName',
                        message: 'CLI name:',
                        validate: validateFilename
                    }
                ],

                function (answers) {
                    this.cliName = answers.cliName;

                    done();
                }.bind(this)
            );
        }
    },

    writing: {
        copyFiles: function () {
            this.fs.copy(this.templatePath('man/man1/.gitkeep'), this.destinationPath(`man/man1/${this.cliName}.1`));
        },

        copyTemplates: function () {
            this.fs.copyTpl(this.templatePath('lib/cli.js'), this.destinationPath(`lib/${this.cliName}-cli.js`), {CLI_NAME: this.cliName});
            // this.fs.copyTpl(this.templatePath('README.md'), this.destinationPath('README.md'), {CLI_NAME: this.cliName});
            this.fs.copyTpl(this.templatePath('src/man/man1/cli.1.md'), this.destinationPath(`src/man/man1/${this.cliName}.1.md`), {CLI_NAME: this.cliName});
        }
    },

    conflicts: {
        mergePackageJson: function () {
            // there has got to be a better way to do this
            // const targetJson = require(this.destinationPath('package.json')),
            //     sourceJson = require(this.templatePath('package.json'));
            const targetJson = this.fs.readJSON(this.destinationPath('package.json')),
                sourceJson = this.fs.readJSON(this.templatePath('package.json'));

            // this.fs.write(this.destinationPath('package.json'), JSON.stringify(Object.assign(targetJson, sourceJson)));
            this.fs.writeJSON(this.destinationPath('package.json'), Object.assign(targetJson, sourceJson));
            this.fs.copyTpl(this.destinationPath('package.json'), this.destinationPath('package.json'), {CLI_NAME: this.cliName});
        }
    },

    // install: {
    //     npmInstall: function () {
    //         this.npmInstall(['minimist'], {save: true});
    //
    //         this.npmInstall([
    //             'marked-man'
    //         ], {
    //             saveDev: true
    //         });
    //     }
    // },

    end: {
        // generateManpage: function () {
        //     this.spawnCommandSync('npm', ['run', 'generate-manpage']);
        // },

        message: function () {
            this.log('Finished with cnn:cli');
        }
    }
});

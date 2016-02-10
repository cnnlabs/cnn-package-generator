'use strict';

const generators = require('yeoman-generator');

module.exports = generators.Base.extend({
    installModules: function () {
        this.npmInstall([
            'marked-man'
        ], {
            saveDev: true
        });
    }
});

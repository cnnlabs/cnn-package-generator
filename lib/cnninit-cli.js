/* global done: false */
'use strict';

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    yeoman = require('yeoman-environment'),
    pack = require('../package'),
    env = yeoman.createEnv();

Object.keys(argv).forEach(function (option) {
    switch (option) {
        case 'h':
            console.log('-h or --help called');
            process.exit(0);
            break;

        case 'v':
            console.log(`cnninit v${pack.version}`);
            process.exit(0);
            break;
    }
});

console.log('CLI code goes here.');

env.register(require.resolve('../generators/cli/'), 'cnn:cli');

env.run('cnn:cli something', {}, function () {
    console.log('SIGH');
});

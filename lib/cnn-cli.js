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

// env.register(require.resolve('../generators/base/'), 'cnn:base');
env.register(require.resolve('../generators/cli/'), 'cnn:cli');

// env.run('cnn:base', {}, function () {
//     console.log('Completed generating cnn:base');
env.run('cnn:cli', {}, function () {
    console.log('Completed generating cnn:cli');
});
// });

'use strict';

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    yeoman = require('yeoman-environment'),
    pack = require('../package'),
    env = yeoman.createEnv();

let generator;

Object.keys(argv).forEach(function (option) {
    switch (option) {
        case 'h':
            console.log('Usage: cnn [OPTIONS] generators');
            console.log('  -h, --help       Show this information');
            console.log('  -v, --version    Show version information');
            console.log('\n  Available generators:\n    cli');
            process.exit(0);
            break;

        case 'v':
            console.log(`cnninit v${pack.version}`);
            process.exit(0);
            break;

        case '_':
            generator = argv[option][0];
            break;
    }
});

if (!generator) {
    console.log('A generator argument is required.  See --help for more details.');
    process.exit(1);
}

switch (generator) {
    case 'cli':
        env.register(require.resolve('../generators/cli/'), 'cnn:cli');
        env.run('cnn:cli', {}, function () {
            console.log('Completed generating cnn:cli');
        });
        break;

    default:
        console.log(`${generator} is an unrecognized generator`);
        process.exit(1);
}




// env.register(require.resolve('../generators/base/'), 'cnn:base');
// env.register(require.resolve('../generators/cli/'), 'cnn:cli');

// env.run('cnn:base', {}, function () {
//     console.log('Completed generating cnn:base');
//     env.run('cnn:cli', {}, function () {
//         console.log('Completed generating cnn:cli');
//     });
// });
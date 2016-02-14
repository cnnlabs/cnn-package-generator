'use strict';

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    yeoman = require('yeoman-environment'),
    pack = require('../package'),
    env = yeoman.createEnv();

let generator;

function message() {
    console.log('Suggested next steps:');
    console.log('  $ git remote add origin [your-repo-url]');
    console.log('  $ git add -A .');
    console.log('  $ git commit -m \'initial commit\'');
    console.log('  $ git push origin master');
}

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
            console.log(`cnn v${pack.version}`);
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

env.register(require.resolve('generator-cnn-base'));
env.register(require.resolve('../generators/cli/'), 'cnn:cli');
// console.log(env.getGeneratorsMeta());

switch (generator) {
    case 'cli':
        env.run('cnn-base', {extend: 'cnn:cli'}, function () {
            message();
        });
        break;

    case 'base':
        env.run('cnn-base', {forego: true}, function () {
            message();
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

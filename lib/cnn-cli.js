'use strict';

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    yeoman = require('yeoman-environment'),
    pack = require('../package'),
    env = yeoman.createEnv();

let generator,
    installedGenerators = {};


// Yes, this is asynchronous and that is a callback, but so far in testing this
// returns so fast there is no need to put this entire script in the callback of
// this one call.
env.lookup(function () {
    installedGenerators = env.getGeneratorsMeta();
});


function listInstalledGenerators() {
    console.log('\nInstalled generators:');

    for (let generator in installedGenerators) {
        // When listing the generators, strip off the :app since it is the
        // default and not required and is really confusing to poeple when the
        // generator is not an app at all.
        let generatorShortName = generator.match(/^(.*):app/) ? generator.match(/^(.*):app/)[1] : generator;
        console.log(`  ${generatorShortName}    ${installedGenerators[generator].resolved}`);
        generator = generatorShortName;
    }
}


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
            listInstalledGenerators();
            process.exit(0);
            break;

        case 'v':
            console.log(`cnn v${pack.version}`);
            process.exit(0);
            break;

        case '_':
            if (argv[option][0]) {
                generator = argv[option][0];

                // If the generator input does not end in :app, append it.
                // https://regex101.com/r/jS8vO5/2
                if (!(/^.+:[^:]+$/.test(generator))) {
                    generator = `${generator}:app`;
                }
            }
            break;
    }
});


if (!generator) {
    console.log('A generator argument is required.  See --help for more details.');
    listInstalledGenerators();
    process.exit(1);
}


if (installedGenerators[generator]) {
    env.run(generator, {}, function () {
        message();
    });
} else {
    console.log(`Generator: "${generator}" not found on this system or it did not install correctly.`);
    listInstalledGenerators();
    process.exit(1);
}

'use strict';

/*
 * Use `minimist` for command line arguments.  More informatin is available at
 * https://github.com/substack/minimist
 */

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    pack = require('../package');

Object.keys(argv).forEach(function (option) {
    switch (option) {
        case 'h':
            console.log('Usage: <%= CLI_NAME %> [OPTIONS]');
            console.log('  -h, --help       Show this information');
            console.log('  -v, --version    Show version information');
            process.exit(0);
            break;

        case 'v':
            console.log(`<%= CLI_NAME %> v${pack.version}`);
            process.exit(0);
            break;
    }
});

console.log('Put your CLI code here');

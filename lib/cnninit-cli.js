'use strict';

const argv = require('minimist')(process.argv.slice(2), {alias: {h: 'help', v: 'version'}}),
    pack = require('../package');

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
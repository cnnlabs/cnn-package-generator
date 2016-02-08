'use strict';

const init = require('init-package-json'),
    initFile = require.resolve('./init-test'),
    dir = process.cwd();
    
init(dir, initFile, function (error, data) {
    if (error) {
        console.error(error.stack);
    }
    
    console.log('written successfully');
}) 
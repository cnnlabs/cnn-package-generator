/* global basename, config, dirname, package, prompt, yes */

var pack = package; // eslint-disable-line

/*
 * This was taken directly from the link below and modified to fit our needs.
 *
 *     https://raw.githubusercontent.com/npm/init-package-json/master/default-input.js
 *
 * This is meant to work with `npm init`, not replace it, which is why
 * init-package-json was not forked for these changes.  See the README in
 * https://github.com/npm/init-package-json for more details.  For clarity, this
 * file is the `initFile` that gets passed in to init-package-json when
 * `npm init` is called.  This will override the default `.npm-init` that is
 * typically used.
 *
 * The globals above, including `package` are available from init-package-json
 * which pulls in this file as part of `npm init`.  `package` is a future
 * reserved word in es6 and can't be used when 'use strict' is applied.  We want
 * this to be as es6 as possible, so the IIFE below is required and the
 * `var pack` above is required to be outside of it.  ESLint on the
 * command line will still blow up with an error, even with eslint-disable-line
 * applied.  ESLint in my IDE seems to not care though. WTF. Anyway, it works.
 *
 * Without the IIFE, you will get this error:
 *
 *     SyntaxError: Block-scoped declarations (let, const, function, class) not yet supported outside strict mode
 *
 * With `var pack = package;` inside the IIFE, you will get this error:
 *
 *     SyntaxError: Unexpected strict mode reserved word
 *
 * With the file as it is, also explained above, you will get this error on the
 * command line when running ESLint, and you may or may not get this error in an
 * IDE.
 *
 *     3:20  error  Parsing error: Use of future reserved word in strict mode
 *
 * Also, trying to reference package as global.package results in undefined.
 */
(function () {
    'use strict';

    const fs = require('fs'),
        path = require('path'),
        npa = require('npm-package-arg'),
        semver = require('semver'),
        validateLicense = require('validate-npm-package-license'),
        validateName = require('validate-npm-package-name'),
        license = pack.license || config.get('init.license') || config.get('init-license') || 'MIT',
        scope = config.get('scope'),
        version = pack.version || config.get('init.version') || config.get('init-version') || '0.1.0';

    let name = pack.name || basename,
        spec = npa(name);

    if (scope) {
        if (scope.charAt(0) !== '@') {
            scope = `@${scope}`;
        }

        if (spec.scope) {
            name = `${scope}/${spec.name.split('/')[1]}`;
        } else {
            name = `${scope}/${name}`;
        }
    }

    exports.name = yes ? name : prompt('name', name, function (data) {
        const its = validateName(data),
            errors = (its.errors || []).concat(its.warnings || []),
            er = new Error(`Sorry, ${errors.join(' and ')}.`);

        if (its.validForNewPackages) {
            return data;
        }

        er.notValid = true;

        return er;
    });

    exports.version = yes ? version : prompt('version', version, function (version) {
        const er = new Error(`Invalid version: "${version}"`);

        if (semver.valid(version)) {
            return version;
        }

        er.notValid = true;

        return er;
    });

    exports.description = yes ? '' : prompt('description');

    exports.main = function (cb) {
        fs.readdir(dirname, function (er, f) {
            let index;

            if (er) {
                f = [];
            }

            f = f.filter(function (f) {
                return f.match(/\.js$/);
            });

            if (f.indexOf('index.js') !== -1) {
                f = 'index.js';
            } else if (f.indexOf('main.js') !== -1) {
                f = 'main.js';
            } else if (f.indexOf(`${basename}.js`) !== -1) {
                f = `${basename}.js`;
            } else {
                f = f[0];
            }

            index = f || 'index.js';

            return cb(null, yes ? index : prompt('entry point', index));
        });
    };

    exports.bin = function (cb) {
        fs.readdir(path.resolve(dirname, 'bin'), function (er, d) {
            if (er) {
                // called if bin doesn't exist
                return cb();
            }

            // just take the first js file we find there, or nada
            return cb(null, d.filter(function (f) {
                return f.match(/\.js$/);
            })[0]);
        });
    };

    exports.man = function (cb) {
        fs.readdir(path.resolve(dirname, 'man'), function (er, d) {
            if (er) {
                // called if man doesn't exist

                return cb();
            }

            return cb(null, 'foo');
        });
    };

    exports.directories = function (cb) {
        fs.readdir(dirname, function (er, dirs) {
            if (er) {
                return cb(er);
            }

            let res = {};

            dirs.forEach(function (d) {
                switch (d) {
                    case 'doc':
                    case 'docs':
                        return res.doc = `./${d}`;

                    case 'example':
                    case 'examples':
                        return res.example = `./${d}`;

                    case 'lib':
                        return res.lib = `./${d}`;

                    case 'man':
                        return res.man = `./${d}`;

                    case 'test':
                    case 'tests':
                        return res.test = `./${d}`;
                }
            });

            if (Object.keys(res).length === 0) {
                res = undefined;
            }

            return cb(null, res);
        });
    };

    exports.scripts = {}; // @TODO add base scripts (there are 6 of them currently)

    exports.repository = function (cb) {
        fs.readFile('.git/config', 'utf8', function (er, gconf) {
            if (er || !gconf) {
                return cb(null, yes ? '' : prompt('git repository'));
            }

            gconf = gconf.split(/\r?\n/);

            const i = gconf.indexOf('[remote "origin"]');

            let u;

            if (i !== -1) {
                u = gconf[i + 1];
                if (!u.match(/^\s*url =/)) {
                    u = gconf[i + 2];
                }

                if (!u.match(/^\s*url =/)) {
                    u = null;
                } else {
                    u = u.replace(/^\s*url = /, '');
                }
            }

            if (u && u.match(/^git@github.com:/)) {
                u = u.replace(/^git@github.com:/, 'https://github.com/');
            }

            return cb(null, yes ? u : prompt('git repository', u));
        });
    };

    exports.engines = {
        node: '>=5.5.0' // @TODO prompt for the version with smart default
    };

    exports.dependencies = {};

    exports.devDependencies = {};

    // @TODO add exports.os in certain conditions

    exports.keywords = yes ? 'cnn cnnlabs' : prompt('keywords', 'cnn cnnlabs', function (s) {
        if (!s) {
            return undefined;
        }

        if (Array.isArray(s)) {
            s = s.join(' ');
        }

        if (typeof s !== 'string') {
            return s;
        }

        return s.split(/[\s,]+/);
    });

    exports.license = yes ? license : prompt('license', license, function (data) {
        const its = validateLicense(data),
            errors = (its.errors || []).concat(its.warnings || []),
            er = new Error(`Sorry, ${errors.join(' and ')}.`);

        if (its.validForNewPackages) {
            return data;
        }

        er.notValid = true;

        return er;
    });
}());

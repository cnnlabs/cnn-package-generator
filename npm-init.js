/* global basename, config, dirname, package, prompt, yes */

var packageJson = package;

/*
 * This file was taken directly from:
 *
 *     https://raw.githubusercontent.com/npm/init-packageJson-json/master/default-input.js
 *
 * and modified to fit our needs.
 */
(function () {
    'use strict';

    const fs = require('fs'),
        path = require('path'),
        npa = require('npm-package-arg'),
        semver = require('semver'),
        validateLicense = require('validate-npm-package-license'),
        validateName = require('validate-npm-package-name'),
        license = packageJson.license || config.get('init.license') || config.get('init-license') || 'ISC',
        notest = '',
        scope = config.get('scope'),
        version = packageJson.version || config.get('init.version') || config.get('init-version') || '1.0.0';

    let name = packageJson.name || basename,
        s = packageJson.scripts || {},
        spec = npa(name);

    function isTestPkg(p) {
        return !!p.match(/^(expresso|mocha|tap|coffee-script|coco|streamline)$/);
    }

    function readDeps(test) {
        return function (cb) {
            fs.readdir('node_modules', function (er, dir) {
                if (er) {
                    return cb();
                }

                let n = dir.length,
                    deps = {};

                if (n === 0) {
                    return cb(null, deps);
                }

                dir.forEach(function (d) {
                    let dp;

                    if (d.match(/^\./)) {
                        return next();
                    }

                    if (test !== isTestPkg(d)) {
                        return next();
                    }

                    dp = path.join(dirname, 'node_modules', d, 'packageJson.json');

                    fs.readFile(dp, 'utf8', function (er, p) {
                        if (er) {
                            return next();
                        }

                        try {
                            p = JSON.parse(p);
                        } catch (e) {
                            return next();
                        }

                        if (!p.version) {
                            return next();
                        }

                        if (p._requiredBy) {
                            if (!p._requiredBy.some(function (req) {
                                return req === '#USER';
                            })) {
                                return next();
                            }
                        }

                        deps[d] = config.get('save-exact') ? p.version : config.get('save-prefix') + p.version;

                        return next();
                    });
                });

                function next() {
                    if (--n === 0) {
                        return cb(null, deps);
                    }
                }
            });
        };
    }

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

    if (!packageJson.description) {
        exports.description = yes ? '' : prompt('description');
    }

    if (!packageJson.main) {
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
    }

    if (!packageJson.bin) {
        exports.bin = function (cb) {
            fs.readdir(path.resolve(dirname, 'bin'), function (er, d) {
                // no bins
                if (er) {
                    return cb();
                }

                // just take the first js file we find there, or nada
                return cb(null, d.filter(function (f) {
                    return f.match(/\.js$/);
                })[0]);
            });
        };
    }

    exports.directories = function (cb) {
        fs.readdir(dirname, function (er, dirs) {
            if (er) {
                return cb(er);
            }

            let res = {};

            dirs.forEach(function (d) {
                switch (d) {
                    case 'example':
                    case 'examples':
                        return res.example = d;

                    case 'test':
                    case 'tests':
                        return res.test = d;

                    case 'doc':
                    case 'docs':
                        return res.doc = d;

                    case 'man':
                        return res.man = d;
                }
            });

            if (Object.keys(res).length === 0) {
                res = undefined;
            }

            return cb(null, res);
        });
    };

    if (!packageJson.dependencies) {
        exports.dependencies = readDeps(false);
    }

    if (!packageJson.devDependencies) {
        exports.devDependencies = readDeps(true);
    }

    if (!packageJson.scripts) {
        exports.scripts = function (cb) {
            fs.readdir(path.join(dirname, 'node_modules'), function (er, d) {
                setupScripts(d || [], cb);
            });
        };
    }

    function setupScripts(d, cb) {
        // check to see what framework is in use, if any
        function tx(test) {
            return test || notest;
        }

        if (!s.test || s.test === notest) {
            const commands = {
                    tap: 'tap test/*.js',
                    expresso: 'expresso test',
                    mocha: 'mocha'
                },
                ps = 'test command';

            let command;

            Object.keys(commands).forEach(function (k) {
                if (d.indexOf(k) !== -1) {
                    command = commands[k];
                }
            });

            if (yes) {
                s.test = command || notest;
            }  else {
                s.test = command ? prompt(ps, command, tx) : prompt(ps, tx);
            }
        }

        return cb(null, s);
    }

    if (!packageJson.repository) {
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
    }

    if (!packageJson.keywords) {
        exports.keywords = yes ? '' : prompt('keywords', function (s) {
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
    }

    if (!packageJson.author) {
        exports.author = config.get('init.author.name') ||
            config.get('init-author-name') ? {
                name: config.get('init.author.name') ||
                    config.get('init-author-name'),
                email: config.get('init.author.email') ||
                    config.get('init-author-email'),
                url: config.get('init.author.url') ||
                    config.get('init-author-url')
            } : yes ? '' : prompt('author');
    }

    exports.license = yes ? license : prompt('license', license, function (data) {
        const its = validateLicense(data),
            errors = (its.errors || []).concat(its.warnings || []),
            er = new Error(`Sorry, ${errors.join(' and ')}.`);

        if (its.validForNewpackages) {
            return data;
        }

        er.notValid = true;

        return er;
    });
}());
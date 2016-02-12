# <%= PROJECT_NAME %>

This is a CNN CLI based project.

Useful things to know:

- CLI code goes in `lib/<%= CLI_NAME %>-cli.js`.  You get -h, --help, -v, and
  --version for free.

- Generate the `man/man1/<%= CLI_NAME %>.1` manpage with
  `npm run generate-manage`.  To edit the manpage, edit
  `src/man/man1/<%= CLI_NAME %>.1.md`.

- Generate the ESDoc documenation in `docs` with `npm run generate-docs`.

- Generate changes for `CHANGELOG.md` with `npm run generate-changelog`.

- Use `npm test` to run unit tests.

- Use `npm run update-check` to check if any dependencies need to be updated.

- Use `npm run update-apply` to apply updates to all dependencies in the
  `package.json`.

import fs from 'fs';

const DEFAULT_FILTER = /^([^\.].*)\.js(on)?$/;

function requireAll() {
  const dirname = __dirname + '/models';
  let modules = [];

  const files = fs.readdirSync(dirname);

  files.forEach(function (file) {
    const filepath = dirname + '/' + file;
    if (!fs.statSync(filepath).isDirectory()) {
      const match = file.match(DEFAULT_FILTER);
      if (!match) return;
      modules.push(require(filepath).default);
    }
  });

  return modules;
};

export const Models = requireAll();


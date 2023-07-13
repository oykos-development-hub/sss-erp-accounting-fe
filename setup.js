import {exec} from 'child_process';

const env = {...process.env};

const ClientLibraryCommand = `npm install git+https://${env.GITLAB_USER?.replace(
  '=',
  '',
).trim()}:${env.GITLAB_PAT?.replace('=', '').trim()}@${env.GITLAB_CLIENT_LIBRARY?.replace('=', '').trim()} --no-save`;

console.log(`\nNPM install Client Library initialized...\nCommand run - `, ClientLibraryCommand);

exec(ClientLibraryCommand, err => {
  if (err) {
    console.error(`NPM install Client Library error: ${err}`);
    return;
  }
  console.log(`\nNPM install Client Library completed!\n`);

  exec('node ./copy-public.cjs', err => {
    if (err) {
      console.error(`Copying /public assets from Client Library error: ${err}`);
      return;
    }
    console.log(`\nCopying /public assets from Client Library completed!\n`);
  });

  exec('node ./load-environment.cjs');
});

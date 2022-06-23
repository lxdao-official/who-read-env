import fs from 'fs';
import path from 'path';
import fsPromise from 'fs/promises';

import colors from 'colors';
function getCallerFileNameAndLine() {
  function getException() {
    try {
      throw Error('');
    } catch (err) {
      return err;
    }
  }

  const err: any = getException();

  const stack = err.stack;
  const stackArr = stack.split('\n');
  if (stackArr && stackArr.length >= 3) {
    return stackArr[4]
      .split('(')[1]
      .split(')')[0]
      .split(':')
      .join(':');
  }
  return '';
}

interface readLog {
  path: string;
  timestamp: number;
  type: 'readFileSync' | 'readFile' | 'readProcessEnv';
}
const readFileEnvLogs: readLog[] = [];
const readFileSyncNew = fs.readFileSync;

//@ts-ignore
fs.readFileSync = function() {
  const filename = path.basename(arguments[0]);
  if (filename.endsWith('.env') || filename.startsWith('.env')) {
    readFileEnvLogs.push({
      path: getCallerFileNameAndLine(),
      timestamp: Date.now(),
      type: 'readFileSync',
    });
    const time = new Date().toLocaleString();
    console.log(
      colors.yellow(`[${time}] read .env file from`),
      getCallerFileNameAndLine()
    );
    console.log('.env file location:', arguments[0]);
  }

  //@ts-ignore
  return readFileSyncNew.apply(this, arguments);
};

const readFileNew = fs.readFile;
//@ts-ignore
fs.readFile = function() {
  const filename = path.basename(arguments[0]);
  if (filename.endsWith('.env') || filename.startsWith('.env')) {
    readFileEnvLogs.push({
      path: getCallerFileNameAndLine(),
      timestamp: Date.now(),
      type: 'readFileSync',
    });
    const time = new Date().toLocaleString();
    console.log(
      colors.yellow(`[${time}] read .env file from`),
      getCallerFileNameAndLine()
    );
    console.log('.env file location:', arguments[0]);
  }
  //@ts-ignore
  return readFileNew.apply(this, arguments);
};

const readFileNewPromise = fsPromise.readFile;

//@ts-ignore
fsPromise.readFile = function() {
  const filename = path.basename(arguments[0]);
  if (filename.endsWith('.env') || filename.startsWith('.env')) {
    readFileEnvLogs.push({
      path: getCallerFileNameAndLine(),
      timestamp: Date.now(),
      type: 'readFileSync',
    });
    const time = new Date().toLocaleString();
    console.log(
      colors.yellow(`[${time}] read .env file from`),
      getCallerFileNameAndLine()
    );
    console.log('.env file location:', arguments[0]);
  }
  //@ts-ignore
  return readFileNewPromise.apply(this, arguments);
};

const readProcessEnvLogs: readLog[] = [];

process = new Proxy(process, {
  get(target: any, prop: any) {
    if (prop === 'env') {
      readProcessEnvLogs.push({
        path: getCallerFileNameAndLine(),
        timestamp: Date.now(),
        type: 'readProcessEnv',
      });
      const time = new Date().toLocaleString();
      console.log(
        colors.yellow(`[${time}] read process.${prop} from`),
        getCallerFileNameAndLine()
      );
    }
    return target[prop];
  },
});
// process.env.USER;
// (async () => {
//   const content = await fsPromise.readFile('./.env.txt');
//   console.log(content.toString());
// })();

// console.log('readFileEnvLogs', readFileEnvLogs);
// console.log('readProcessEnvLogs', readProcessEnvLogs);

export const report = function() {
  console.log('readFileEnvLogs', readFileEnvLogs);
  console.log('readProcessEnvLogs', readProcessEnvLogs);
};

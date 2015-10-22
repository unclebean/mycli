#!/usr/bin/env node
var chalk = require('chalk');
var argv = require('minimist')(process.argv.slice(2));
console.log(chalk.yellow(JSON.stringify(argv)));

/*
console.log(chalk.red(process.argv));
var _args = process.argv.slice(2);
console.log('Args: ', _args);

switch (_args[0]) {
  case 'insult':
    console.log(chalk.magenta(_args[1]), 'smells quite badly.');
    break;
  case 'compliment':
    console.log(chalk.magenta(_args[1]), 'is really cool.');
    break;
  default:
    console.log('Sorry, that is not something I know how to do.');
}
*/

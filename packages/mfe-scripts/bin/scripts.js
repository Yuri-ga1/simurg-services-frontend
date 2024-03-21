#!/usr/bin/env node

const args = process.argv.slice(2);
require('../src/' + args[0]);

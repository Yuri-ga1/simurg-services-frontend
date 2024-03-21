#!/usr/bin/env node

const args = process.argv.slice(2);
require('../scripts/' + args[0]);

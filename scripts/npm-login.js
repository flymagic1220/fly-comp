#!/usr/bin/env node

const { execSync } = require('child_process');

const registry = 'http://82.156.128.233:4873/';
const username = 'admin';
const password = 'admin@123';
const email = '728427899@qq.com';

console.log(`Logging in to ${registry}...`);

try {
  execSync(`npm login --registry=${registry}`, {
    stdio: 'pipe',
    input: `${username}\n${password}\n${email}\n`
  });
  console.log('✅ Login successful');
} catch (error) {
  console.error('❌ Login failed:', error.message);
  process.exit(1);
}
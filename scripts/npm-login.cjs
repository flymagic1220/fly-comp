#!/usr/bin/env node

const { exec } = require('child_process');

const registry = 'http://82.156.128.233:4873/';
const username = 'admin';
const password = 'admin@123';
const email = '728427899@qq.com';

console.log(`Registry: ${registry}`);
console.log(`Username: ${username}`);
console.log(`Email: ${email}`);
console.log('Logging in...');

const child = exec(`npm login --registry=${registry}`);

child.stdout.on('data', (d) => {
  const data = d.toString();
  process.stdout.write(data);
  if (/username/i.test(data)) {
    child.stdin.write(`${username}\n`);
  } else if (/password/i.test(data)) {
    child.stdin.write(`${password}\n`);
  } else if (/email/i.test(data)) {
    child.stdin.write(`${email}\n`);
  } else if (/logged/i.test(data)) {
    console.log('✅ Login successful');
    child.stdin.end();
  }
});

child.stderr.on('data', (d) => {
  console.log('stderr:', d.toString());
});

child.on('close', (code) => {
  if (code !== 0) {
    console.error(`❌ Login failed with code ${code}`);
    process.exit(code);
  }
});

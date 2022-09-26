import * as process from 'process'
import {spawnSync} from 'node:child_process';
import * as path from 'path'
import {expect, test} from '@jest/globals'

// shows how the runner will run a javascript action with env / stdout protocol
test('Upload Policies Client Secret', () => {
  process.env['INPUT_POLICYFOLDER'] = process.env['POLICYFOLDER']
  process.env['INPUT_TENANT'] = process.env['TENANT']
  process.env['INPUT_CLIENTID'] = process.env['CLIENTID']
  process.env['INPUT_CLIENTSECRET'] = process.env['CLIENTSECRET']
  process.env['INPUT_VERBOSE'] = 'true'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
const result = spawnSync(
  `"${np}"`, [`"${ip}"`],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf-8',
    shell: true,
    env: process.env
  }
);
if (result.stdout)  {
  console.log(result.stdout.toString());
}
if (result.stderr)  {
    console.error(result.stderr.toString());
}

expect(result.stdout).not.toContain("::error::");
expect(result.stderr).toBeFalsy();
expect(result.status).toBe(0);

})

test('Upload Policies Client Certificate', () => {
  process.env['INPUT_POLICYFOLDER'] = process.env['POLICYFOLDER']
  process.env['INPUT_TENANT'] = process.env['TENANT']
  process.env['INPUT_CLIENTID'] = process.env['CLIENTID']
  process.env['INPUT_CLIENTCERTIFICATETHUMBPRINT'] = process.env['CLIENTCERTIFICATETHUMBPRINT']
  process.env['INPUT_CLIENTCERTIFICATEKEY'] = process.env['CLIENTCERTIFICATEKEY']
  process.env['INPUT_CLIENTCERTIFICATEPASS'] = process.env['CLIENTCERTIFICATEPASS']
  process.env['INPUT_VERBOSE'] = 'true'
  const np = process.execPath
  const ip = path.join(__dirname, '..', 'lib', 'main.js')
const result = spawnSync(
  `"${np}"`, [`"${ip}"`],
  {
    stdio: ['ignore', 'pipe', 'pipe'],
    encoding: 'utf-8',
    shell: true,
    env: process.env
  }
);
if (result.stdout)  {
  console.log(result.stdout.toString());
}
if (result.stderr)  {
    console.error(result.stderr.toString());
}

expect(result.stdout).not.toContain("::error::");
expect(result.stderr).toBeFalsy();
expect(result.status).toBe(0);

})


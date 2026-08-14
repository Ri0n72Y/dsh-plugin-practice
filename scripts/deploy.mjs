#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const args = process.argv.slice(2)

let profile = 'practice'
let packOnly = false
for (let index = 0; index < args.length; index += 1) {
  const arg = args[index]
  if (arg === '--profile') {
    profile = args[index + 1] ?? profile
    index += 1
  } else if (arg.startsWith('--profile=')) {
    profile = arg.slice('--profile='.length) || profile
  } else if (arg === '--pack-only') {
    packOnly = true
  } else if (!arg.startsWith('-')) {
    profile = arg
  }
}

function command(name) {
  return process.platform === 'win32' ? `${name}.cmd` : name
}

function run(name, commandArgs) {
  const result = spawnSync(command(name), commandArgs, {
    cwd: root,
    stdio: 'inherit',
  })

  if (result.error) throw result.error
  if (result.status !== 0) process.exit(result.status ?? 1)
}

if (existsSync(join(root, 'src'))) {
  console.log('[deploy] building plugin bundle...')
  run('pnpm', ['run', 'build'])
} else if (!existsSync(join(root, 'lib'))) {
  throw new Error('Neither src/ nor built lib/ exists; cannot deploy this package.')
}

const packDir = join(root, '.dsh-pack')
const stagingDir = join(packDir, 'staging')
rmSync(packDir, { recursive: true, force: true })
mkdirSync(stagingDir, { recursive: true })

const sourceManifest = JSON.parse(readFileSync(join(root, 'package.json'), 'utf8'))
const runtimeManifest = {
  name: sourceManifest.name,
  version: sourceManifest.version,
  description: sourceManifest.description,
  private: sourceManifest.private,
  type: sourceManifest.type,
  engines: sourceManifest.engines,
  main: sourceManifest.main,
  exports: sourceManifest.exports,
  files: ['lib/**/*.js', 'cordis.patch.yml', 'README.md', 'LICENSE'],
  dsh: sourceManifest.dsh,
  peerDependencies: sourceManifest.peerDependencies,
  dependencies: sourceManifest.dependencies,
  repository: sourceManifest.repository,
  license: sourceManifest.license,
}

writeFileSync(
  join(stagingDir, 'package.json'),
  `${JSON.stringify(runtimeManifest, null, 2)}\n`,
)
cpSync(join(root, 'lib'), join(stagingDir, 'lib'), { recursive: true })
cpSync(join(root, 'cordis.patch.yml'), join(stagingDir, 'cordis.patch.yml'))
cpSync(join(root, 'README.md'), join(stagingDir, 'README.md'))
if (existsSync(join(root, 'LICENSE'))) {
  cpSync(join(root, 'LICENSE'), join(stagingDir, 'LICENSE'))
}

console.log('[deploy] packing staged runtime bundle...')
run('npm', ['pack', stagingDir, '--pack-destination', packDir])

const tarballs = readdirSync(packDir).filter(name => name.endsWith('.tgz'))
if (tarballs.length !== 1) {
  throw new Error(`Expected exactly one tarball in ${packDir}, found ${tarballs.length}.`)
}

const tarball = join(packDir, tarballs[0])
console.log(`[deploy] created ${tarballs[0]}`)

if (packOnly) process.exit(0)

console.log(`[deploy] installing into DSH profile "${profile}"...`)
run('dsh', ['plugin', '--profile', profile, 'add', tarball])

console.log('[deploy] verifying composed profile...')
run('dsh', ['--profile', profile, '--dump-config'])

console.log(`\n[deploy] installed ${tarballs[0]} into profile "${profile}".`)
console.log(`[deploy] start with: dsh --profile ${profile}`)

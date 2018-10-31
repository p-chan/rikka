#!/usr/bin/env node
'use strict'

const cac = require('cac')
const consola = require('consola')
const fs = require('fs')
const mkdirp = require('mkdirp')
const moment = require('moment')
const mustache = require('mustache')
const path = require('path')
const pkg = require('./package.json')
const util = require('util')

const cli = cac()

const defaultCommand = cli.command(
  'new',
  {
    desc: 'Generate new content'
  },
  async (input, flags) => {
    const templateVars = {
      date: moment().format(),
      unixtime: moment().unix(),
      generator: 'rikka',
      generatorVersion: pkg.version
    }

    const contentPath = input[0]
    const contentPathInfo = path.parse(contentPath)

    const archetypeDirName = flags.archetypeDir || 'archetypes'
    const contentDirName = flags.contentDir || 'contents'

    let archetypeFilePath = false
    let targetArchetypeFilePath = ''

    const contentDirPath = path.resolve(
      __dirname,
      contentDirName,
      contentPathInfo.dir
    )
    const contentFilePath = mustache.render(
      path.resolve(contentDirPath, contentPathInfo.base),
      templateVars
    )

    // Check already exists
    const isAlready = await util
      .promisify(fs.stat)(contentFilePath)
      .then(stats => {
        consola.error('This content file is already exists')
        process.exit(1)
      })
      .catch(err => {
        return false
      })

    // rikka new ./log/hoge.md -> 'log'
    let targetArchetypeFileName = contentPath
      .split(path.sep)
      .filter(v => {
        // rikka new ./log/hoge.md -> ['.', 'log', 'hoge.md'] -> ['log', 'hoge.md']
        const firstStr = v.slice(0, 1)
        return firstStr !== '.'
      })
      .reduce((p, c, i, a) => {
        let target = p ? p : false

        // rikka new ./hoge.md -> [hoge.md]
        if (a.length < 2) {
          return
        }

        if (i == 0) {
          target = c
        }

        return target
      }, false)

    // Search ./archetypes/log.md
    if (!archetypeFilePath) {
      targetArchetypeFilePath = path.resolve(
        __dirname,
        archetypeDirName,
        `${targetArchetypeFileName}.md`
      )

      await util
        .promisify(fs.stat)(targetArchetypeFilePath)
        .then(stats => {
          archetypeFilePath = targetArchetypeFilePath
        })
        .catch(err => {
          return false
        })
    }

    // Search ./archetypes/default.md
    if (!archetypeFilePath) {
      targetArchetypeFilePath = path.resolve(
        __dirname,
        archetypeDirName,
        'default.md'
      )

      await util
        .promisify(fs.stat)(targetArchetypeFilePath)
        .then(stats => {
          archetypeFilePath = targetArchetypeFilePath
        })
        .catch(err => {
          return false
        })
    }

    let rendered = ''

    // If success found archetype file when render template
    if (archetypeFilePath) {
      const template = await util.promisify(fs.readFile)(
        path.resolve(__dirname, archetypeDirName, archetypeFilePath),
        'utf-8'
      )

      rendered = mustache.render(template, templateVars)
    }

    // If not found archetype file when output warning
    if (!archetypeFilePath) {
      consola.warn('Archetype file is not found')
    }

    await util.promisify(mkdirp)(contentDirPath)
    await util
      .promisify(fs.writeFile)(
        contentFilePath,
        archetypeFilePath ? rendered : ''
      )
      .then(() => {
        consola.success('Generated new content')
      })
  }
)

defaultCommand
  .option('archetypeDir', {
    desc: 'Archetypes directory',
    default: 'archetypes'
  })
  .option('contentDir', {
    desc: 'Contents directory',
    default: 'contents'
  })

cli.parse()

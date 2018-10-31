# rikka

> A CLI tool to create new content for static site inspired by [hugo new](https://gohugo.io/commands/hugo_new/)

![Rikka Takarada](https://i.imgur.com/aZW5a7j.gif)

## Install

```
$ npm install rikka -g
```

## Usage

`rikka` is currently has only the `new` command.

### Create new content

```
$ rikka new log/example.md
```

Generate new file to `contents/log/example.md`.

### Chenge archetypes directory or contents directory or both

With this option you can change archetypes diretory or contents directory or both.

```
$ rikka new about/example.md --archetypeDir customArchetypes --contentsDir customContents
```

Generate new file to `customContents/about/example.md`.

## Archetypes

Archetypes are templates used when creating new content.

### Use case

If this command is executed, rikka looks for `archetypes/log.md`.

```
$ rikka new log/example.md
```

Then, it generates `contents/log/example.md` based on `archetypes/log.md`.


If `archetypes/log.md` can not be found, rikka looks for `archetypes/default.md`. If it exists, rikka creates `contents/log/example.md` based on `archetypes/default.md`.

If `archetypes/log.md` and `archetypes/default.md` can not be found, rikka generates empty file in `contents/log/example.md`.

### Priority order of the templates

When `rikka new log/example.md` is executed, the priority order of the templates is as follows.

1. `archetypes/log.md`
2. `archetypes/default.md`
3. Create empty file

## Template variables

Template variables can be used in a archetype file or the CLI.

### All template variables

| Varialbe | Example | Description |
|:---|:---|:---|
| `{{ date }}` | 2018-10-31T23:33:30+09:00 | Return date |
| `{{ unixtime }}` | 1540996410 | Return unixtime |
| `{{ generator }}` | rikka | Return generator |
| `{{ generatorVersion }}` | 1.0.0 | Return generator version |

### Used in archetype file

Make such a file in archetypes directory.

```archetypes/log.md
---
title: log
published_at: {{ date }}
generator_info: {{ generator }} v{{ generatorVersion }}
---
```

Execute `rikka new log/example.md` assigns some template variables and output.

```contents/log/example.md
---
title: log
published_at: 2018-10-31T23:33:30+09:00
generator_info: rikka v1.0.0
---
```

### Used in the CLI

Template variables can also be used in the CLI.  
For example, when such a command is executed.

```
$ rikka new "log/{{ unixtime }}.md"
```

Then, a file like `contents/log/1540996410.md` is generated.

## Help

```
$ rikka -h
$ rikka new -h
```

## Author

[@p-chan](https://github.com/p-chan)

## License

MIT

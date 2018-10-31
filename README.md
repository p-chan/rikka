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
$ rikka new ./log/example.md
```

To `./contents/log/example.md` with `./archetypes/log.md` or `./archetypes/default.md`

### Can setting options

```
$ rikka new ./about/example.md --archetypeDir ./custom/archetype --contentsDir ./custom/contents
```

To `./custom/contents/about/example.md` with `./custom/archetype/about.md` or `./custom/archetype/default.md`

## Help

```
$ rikka -h
$ rikka new -h
```

## Author

P-Chan

## License

MIT

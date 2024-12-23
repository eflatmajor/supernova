# Supernova

Supernova is an experimental web-based "hybrid" game that aims to blend the experience of playing a text adventure with aspects of "normal" games - that is, games with a user interface.

For example, while a lot of the core gameplay will be text/command-based, you'll be able to interact with UIs for such things as:
- viewing your inventory
- viewing the inventories of containers
- engaging in dialogue with an NPC
- viewing your character sheet
- etc.

It's built using Vue with Vite as the build tool.

This project is currently pre-alpha software.

## Running the dev server

```sh
npm install
npm run dev
```

## Running a production build

```sh
npm run build
npx http-server dist
```

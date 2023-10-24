# Obsidian plugin for Halo

This plugin allows you to publish your Obsidian documents to [Halo](https://github.com/halo-dev/halo).

> Note: This plugin is still in development, and is not ready for production use.

## TODO

- [ ] i18n
- [ ] Upload images

## Development

1. [Create a new Obisidian vault](https://help.obsidian.md/Getting+started/Create+a+vault) for development.
2. Clone this repo to the **plugins folder** of the newly created vault.

   ```bash
   cd path/to/vault/.obsidian/plugins

   git clone https://github.com/ruibaby/obsidian-halo
   ```

3. Install dependencies

   ```bash
   cd obsidian-halo

   npm install
   ```

4. Build the plugin

   ```bash
   npm run dev
   ```

5. Reload Obsidian and enable the plugin in Settings.

## Preview

![settings](./images/settings.png)

![commands](./images/commands.png)

## Credits

- [obsidian-wordpress](https://github.com/devbean/obsidian-wordpress): the original idea came from this repo.

# yamdbf-anilist-unofficial
A YAMDBF plugin which allows users to easily retrieve details about anime, manga and their characters from [Anilist](https://anilist.co).

# Installing
- Install the package via `npm` (requires `git` to be installed):
```
npm i -S SpaceEEC/yamdbf-anilist-unofficial
```
> Note: YAMDBF 3.0.0 is required to use this plugin since plugin support was/will be added with that version.

- Add it to your client's plugins, here an example:
```ts
import { Client, PluginConstructor } from 'yamdbf';
import { AniList } from 'yamdbf-anilist-unofficial';

const anilist: PluginConstructor = AniList({
	clientId: 'your clientId',
	clientSecret: 'your clientSecret',
});

const client: Client = new Client({
	plugins: [anilist],
});
```
> Note: This plugin's build method is exported as `AniList`, and `default`.

# Commands
This plugin will add 3 commands to your bot
- anime
- character (aliased with char)
- manga
> Usage: `<prefix>command <...Search>`

For example:

`!anime Nisemonogatari`

Will display an embed filled with information about Nisemonogatari.

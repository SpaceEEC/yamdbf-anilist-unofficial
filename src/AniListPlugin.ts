import { join } from 'path';
// tslint:disable-next-line:no-implicit-dependencies
import { Client, IPlugin, Lang, Plugin, PluginConstructor, SharedProviderStorage } from 'yamdbf';

import { AnimeCommand } from './commands/Anime';
import { CharacterCommand } from './commands/Char';
import { MangaCommand } from './commands/Manga';
import { AniListAPI } from './structures/AniListAPI';
import { AniCredentials } from './types/';

/**
 * AniListPlugin that allows users to get details about their
 * requested anime, manga or characters.
 */
export class AniListPlugin extends Plugin implements IPlugin
{
	/**
	 * Static build method to pass client credentials to this plugin.
	 * @param {AniCredentials} credentials The required client credentials
	 * @returns {PluginConstructor} Pass this to the YAMDBFOptions's plugins array
	 * @static
	 */
	public static build({ clientId, clientSecret }: AniCredentials): PluginConstructor
	{
		// tslint:disable-next-line:max-classes-per-file
		return class extends AniListPlugin
		{
			public constructor(client: Client)
			{
				super(client, { clientId, clientSecret });
			}
		};
	}

	/**
	 * Name of this plugin
	 * @readonly
	 */
	public readonly name: string = 'AniList-Unofficial';
	/**
	 * Reference to the AniListAPI class instance
	 * @readonly
	 */
	public readonly api: AniListAPI;
	/**
	 * Reference to the instantiating client
	 * @readonly
	 */
	public readonly client: Client;
	/**
	 * Reference to the shared provider storage
	 */
	public provider: SharedProviderStorage;

	/**
	 * Instantiates the AniListPlugin class
	 * @param {Client} client
	 * @param {AniCredentials} credentials
	 * @protected
	 */
	protected constructor(client: Client, credentials: AniCredentials)
	{
		super();

		this.api = new AniListAPI(this, credentials);
		this.client = client;
	}

	/**
	 * Initializes the AniListPlugin
	 * @returns {Promise<void>}
	 */
	public async init(provider: SharedProviderStorage): Promise<void>
	{
		this.provider = provider;

		const dir: string = join(__dirname, 'localization');
		Lang.loadCommandLocalizationsFrom(dir);
		Lang.loadLocalizationsFrom(dir);
		Lang.loadGroupLocalizationsFrom(dir);

		this.client.commands.registerExternal(new AnimeCommand(this));
		this.client.commands.registerExternal(new CharacterCommand(this));
		this.client.commands.registerExternal(new MangaCommand(this));
	}
}

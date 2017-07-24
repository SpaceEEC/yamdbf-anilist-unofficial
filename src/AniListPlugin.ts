import { join } from 'path';
import { Client, IPlugin, Lang, Plugin, PluginConstructor } from 'yamdbf';

import { AnimeCommand } from './commands/Anime';
import { CharacterCommand } from './commands/Char';
import { MangaCommand } from './commands/Manga';
import { AniListAPI } from './structures/AniListAPI';
import { AniCredentials } from './types/';

/**
 * AniListPlugin that allows users to get details about their
 * requested anime, manga or char
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
	 * @returns {Promise<void>}<
	 */
	public async init(): Promise<void>
	{
		Lang.loadCommandLocalizationsFrom(join(__dirname, 'localization'));
		Lang.loadLocalizationsFrom(join(__dirname, 'localization'));

		this.client.commands.registerExternal(new AnimeCommand(this));
		this.client.commands.registerExternal(new CharacterCommand(this));
		this.client.commands.registerExternal(new MangaCommand(this));
	}
}

import { Collection, RichEmbed, Snowflake } from 'discord.js';
import { Client, Command as YAMFBFCommand, Message, ResourceLoader, Util } from 'yamdbf';

import { AniListPlugin } from '../AniListPlugin';
import { LocalizationStrings as S } from '../localization/LocalizationStrings';
import { AnimeData, CharData, MangaData } from '../types/AniData';

/**
 * Abstract command class to provide functionalities for all commands without having tons of code duplication.
 * @abstract
 */
abstract class Command<T extends Client> extends YAMFBFCommand<T>
{
	/**
	 * Reference to the plugin
	 * @protected
	 * @readonly
	 */
	protected readonly plugin: AniListPlugin;

	/**
	 * Instantiates an command extending this class
	 * @param {AniListPlugin} plugin
	 */
	public constructor(plugin: AniListPlugin)
	{
		super();

		this.plugin = plugin;
	}

	/**
	 * Prompts the user to pick between one of the found results.
	 * @param {ResourceLoader} res
	 * @param {Message} message Original message
	 * @param {(AnimeData | CharData | MangaData)[]} data Array of data
	 * @param {AniType} type The requested content type
	 * @returns {Promise<AnimeData | CharData | MangaData>}
	 * @protected
	 */
	protected async pick<U extends (AnimeData | CharData | MangaData)>(res: ResourceLoader, message: Message, data: U[])
		: Promise<U>
	{
		const mappedNames: string[] = [];
		let count: number = 0;

		const length: number = String(data.length).length;
		if (['manga', 'anime'].includes(data[0].series_type))
		{
			for (const entry of data as (AnimeData | MangaData)[])
			{
				mappedNames.push(`\`${Util.padRight(String(++count), length)}\` - ${entry.title_english}`);
			}

		}
		else
		{
			for (const char of data as CharData[])
			{
				mappedNames.push(`\`${Util.padRight(String(++count), length)}\` - ${char.name_first} ${char.name_last || ''}`);
			}
		}

		const embed: RichEmbed = new RichEmbed()
			.setColor(message.member.displayColor)
			.setTitle(res(S.PLUGIN_ANILIST_PICK_PROMPT_TITLE, { type: data[0].series_type || 'char' }))
			.setDescription(mappedNames.join('\n').slice(0, 2000))
			.addField(res(S.PLUGIN_ANILIST_PICK_PROMPT_FIELD_TITLE),
			res(S.PLUGIN_ANILIST_PICK_PROMPT_FIELD_VALUE,
				{
					type: data[0].series_type || 'char',
				},
			),
		);

		const prompt: Message = await message.channel.send({ embed }) as Message;
		const response: Message = await message.channel.awaitMessages(
			(m: Message) => m.author.id === message.author.id,
			{ maxMatches: 1, time: 3e4 },
		).then((collected: Collection<Snowflake, Message>) => collected.first());

		prompt.delete().catch(() => null);
		if (response && response.deletable) response.delete().catch(() => null);

		if (!response || response.content.toLowerCase() === 'cancel')
		{
			return null;
		}

		return data[parseInt(response.content.split(' ')[0]) - 1] || null;
	}
}

// renamed export because yamdbf is a bit picky about command class validation
export { Command as AniCommand };

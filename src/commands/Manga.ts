import { Client, CommandDecorators, Message, Middleware, ResourceLoader } from 'yamdbf';

import { AniCommand } from '../structures/AniCommand';
import { RichEmbed } from '../structures/RichEmbed';
import { MangaData } from '../types/AniData';
import { AniType } from '../types/AniType';
import { Util } from '../Util';

const { expect } = Middleware;
const { clientPermissions, desc, group, using, guildOnly, name, usage, localizable } = CommandDecorators;

@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays information about the requested manga.')
@name('manga')
@group('anilist')
@guildOnly
@usage('<prefix>manga <...Search>')
export class MangaCommand extends AniCommand<Client>
{
	@using(expect({ '<...Search>': 'String' }))
	// tslint:disable-next-line:no-shadowed-variable
	@using((message: Message, args: string[]) => [message, [args.join(' ')]])
	@localizable
	public async action(message: Message, [res, search]: [ResourceLoader, string]): Promise<void>
	{
		const data: MangaData[] = await this.plugin.api.search<MangaData>(AniType.MANGA, search);

		if (!data)
		{
			return message.channel.send(res('PLUGIN_ANILIST_NOTHING_FOUND'))
				.then(() => undefined);
		}

		const manga: MangaData = data.length > 1
			? await this.pick(res, message, data)
			: data[0];

		if (!manga)
		{
			return message.channel.send(res('PLUGIN_ANILIST_CANCELLED'))
				.then(() => undefined);
		}

		const genres: string = Util.chunkArray(manga.genres, 3).map((chunk: string[]) => chunk.join(', ')).join('\n');

		const embed: RichEmbed = new RichEmbed()
			.setColor(0x0800ff)
			.setThumbnail(manga.image_url_lge)
			.setTitle(manga.title_japanese)
			.setDescription(
			manga.title_romaji === manga.title_english
				? manga.title_english
				: `${manga.title_romaji}\n${manga.title_english}`)
			.addField(res('PLUGIN_ANILIST_GENRES_TITLE'), genres || res('PLUGIN_ANILIST_NOT_SPECIFIED'), true)
			.addField(res('PLUGIN_ANILIST_RATING_TYPE_TITLE'), `${manga.average_score} | ${manga.type}`, true)
			.addField(res('PLUGIN_ANILIST_CHAPTERS_VOLUMES'), `${manga.total_chapters} | ${manga.total_volumes}`, true);

		if (manga.start_date_fuzzy)
		{
			let title: string;
			let value: string = Util.formatFuzzy(manga.start_date_fuzzy);
			if (manga.publishing_status === 'finished publishing')
			{
				title = res('PLUGIN_ANILIST_PERIOD_TITLE');
				value += ` - ${Util.formatFuzzy(manga.end_date_fuzzy) || res('PLUGIN_ANILIST_NOT_SPECIFIED')}`;
			}
			else
			{
				title = res('PLUGIN_ANILIST_START_TITLE');
			}

			embed.addField(title, value, true);
		}

		embed.splitToFields(res('PLUGIN_ANILIST_DESCRIPTION'), manga.description
			? Util.replaceMap(manga.description, Util.replaceChars)
			: res('PLUGIN_ANILIST_NOT_SPECIFIED'))
			.addField(res('PLUGIN_ANILIST_PUBLISHING_STATUS'),
			manga.publishing_status
				? res('PLUGIN_ANILIST_STATUS_VALUE', { status: manga.publishing_status })
				: res('PLUGIN_ANILIST_NOT_SPECIFIED'),
			true);

		return message.channel.send({ embed })
			.then(() => undefined);
	}
}

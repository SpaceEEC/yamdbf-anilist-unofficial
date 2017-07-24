import { Client, CommandDecorators, Message, Middleware, ResourceLoader } from 'yamdbf';

import { AniCommand } from '../structures/AniCommand';
import { RichEmbed } from '../structures/RichEmbed';
import { AnimeData } from '../types/AniData';
import { AniType } from '../types/AniType';
import { Util } from '../Util';

const { expect } = Middleware;
const { clientPermissions, desc, group, using, guildOnly, name, usage, localizable } = CommandDecorators;

@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays information about the requested anime.')
@name('anime')
@group('anilist')
@guildOnly
@usage('<prefix>anime <...Search>')
export class AnimeCommand extends AniCommand<Client>
{
	@using(expect({ '<...Search>': 'String' }))
	// tslint:disable-next-line:no-shadowed-variable
	@using((message: Message, args: string[]) => [message, [args.join(' ')]])
	@localizable
	public async action(message: Message, [res, search]: [ResourceLoader, string]): Promise<void>
	{
		const data: AnimeData[] = await this.plugin.api.search<AnimeData>(AniType.ANIME, search);

		if (!data)
		{
			return message.channel.send(res('PLUGIN_ANILIST_NOTHING_FOUND'))
				.then(() => null);
		}

		const anime: AnimeData = data.length > 1
			? await this.pick(res, message, data)
			: data[0];

		if (!anime)
		{
			return message.channel.send(res('PLUGIN_ANILIST_CANCELLED'))
				.then(() => null);
		}

		const genres: string = Util.chunkArray(anime.genres, 3).map((chunk: string[]) => chunk.join(', ')).join('\n');

		const embed: RichEmbed = new RichEmbed()
			.setColor(0x0800ff)
			.setThumbnail(anime.image_url_lge)
			.setTitle(anime.title_japanese)
			.setDescription(
			anime.title_romaji === anime.title_english
				? anime.title_english
				: `${anime.title_romaji}\n\n${anime.title_english}`)
			.addField(res('PLUGIN_ANILIST_GENRES_TITLE'), genres || res('PLUGIN_ANILIST_NOT_SPECIFIED'), true)
			.addField(res('PLUGIN_ANILIST_RATING_TYPE_TITLE'), `${anime.average_score} | ${anime.type}`, true)
			.addField(res('PLUGIN_ANILIST_EPISODES_TITLE'), anime.total_episodes, true);

		if (anime.start_date_fuzzy)
		{
			let title: string;
			let value: string = Util.formatFuzzy(anime.start_date_fuzzy);
			if (anime.airing_status === 'finished airing')
			{
				title = res('PLUGIN_ANILIST_PERIOD_TITLE');
				value += ` - ${Util.formatFuzzy(anime.end_date_fuzzy) || res('PLUGIN_ANILIST_NOT_SPECIFIED')}`;
			}
			else
			{
				title = res('PLUGIN_ANILIST_START_TITLE');
			}

			embed.addField(title, value, true);
		}

		embed.splitToFields(res('PLUGIN_ANILIST_DESCRIPTION'), anime.description
			? Util.replaceMap(anime.description, Util.replaceChars)
			: res('PLUGIN_ANILIST_NOT_SPECIFIED'));

		embed.addField(res('PLUGIN_ANILIST_AIRING_STATUS_TITLE'),
			anime.airing_status ?
				res('PLUGIN_ANILIST_STATUS_VALUE', { status: anime.airing_status })
				: res('PLUGIN_ANILIST_NOT_SPECIFIED'),
			true)
			.addField(res('PLUGIN_ANILIST_ORIGIN'),
			anime.source || res('PLUGIN_ANILIST_NOT_SPECIFIED'), true);

		return message.channel.send({ embed })
			.then(() => null);
	}
}

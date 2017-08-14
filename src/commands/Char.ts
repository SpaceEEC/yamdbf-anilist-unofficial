import { Client, CommandDecorators, Message, Middleware, ResourceLoader } from 'yamdbf';

import { LocalizationStrings as S } from '../localization/LocalizationStrings';
import { AniCommand } from '../structures/AniCommand';
import { RichEmbed } from '../structures/RichEmbed';
import { CharData } from '../types/AniData';
import { AniType } from '../types/AniType';
import { Util } from '../Util';

const { expect } = Middleware;
const { aliases, clientPermissions, desc, group, guildOnly, name, usage, using, localizable } = CommandDecorators;

@aliases('char')
@clientPermissions('SEND_MESSAGES', 'EMBED_LINKS')
@desc('Displays information about the requested character.')
@name('character')
@group('anilist')
@guildOnly
@usage('<prefix>char <...Search>')
export class CharacterCommand extends AniCommand<Client>
{
	@using(expect({ '<...Search>': 'String' }))
	// tslint:disable-next-line:no-shadowed-variable
	@using((message: Message, args: string[]) => [message, [args.join(' ')]])
	@localizable
	public async action(message: Message, [res, search]: [ResourceLoader, string]): Promise<void>
	{
		const data: CharData[] = await this.plugin.api.search<CharData>(AniType.CHARACTER, search);

		if (!data)
		{
			return message.channel.send(res(S.PLUGIN_ANILIST_NOTHING_FOUND))
				.then(() => undefined);
		}

		const char: CharData = data.length > 1
			? await this.pick(res, message, data)
			: data[0];

		if (!char)
		{
			return message.channel.send(res(S.PLUGIN_ANILIST_CANCELLED))
				.then(() => undefined);
		}

		const embed: RichEmbed = new RichEmbed()
			.setColor(0x0800ff)
			.setThumbnail(char.image_url_lge)
			.setTitle(`${char.name_first || ''} ${char.name_last || ''}\u200b`)
			.setDescription(char.name_japanese || '');

		if (char.name_alt)
		{
			embed.addField('Aliases:', char.name_alt);
		}

		embed.splitToFields(res(S.PLUGIN_ANILIST_DESCRIPTION), char.info
			? Util.replaceMap(char.info, Util.replaceChars)
			: res(S.PLUGIN_ANILIST_NOT_SPECIFIED));

		return message.channel.send({ embed })
			.then(() => undefined);
	}
}

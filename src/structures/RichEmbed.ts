import { RichEmbed as DJSRichEmbed } from 'discord.js';

/**
 * Extended Discord.js RichEmbed class which provides a `splitToFields` method.
 */
export class RichEmbed extends DJSRichEmbed
{
	/**
	 * Splits a long string into multiple fields for this embed.
	 * @param {string} [title='\u200b'] The title of the first field
	 * @param {string} text The long string to split
	 * @param {boolean} [inline=false] Whether the fields should be inline
	 * @returns {RichEmbed}
	 */
	public splitToFields(title: string = '\u200b', text: string, inline: boolean = false): RichEmbed
	{
		const stringArray: string[] = text.match(/(.|[\r\n]){1,1024}/g);

		for (const [i, chunk] of stringArray.entries())
		{
			this.addField(i ? '\u200b' : title, chunk, inline);
		}

		return this;
	}
}

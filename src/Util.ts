export class Util
{
	/**
	 * Dict with chars to replace
	 * @static
	 * @readonly
	 */
	public static readonly replaceChars: { [char: string]: string } = {
		'&#039;': '\'',
		'&amp;': '&',
		'&gt;': '>',
		'&lt;': '<',
		'&quot;': '"',
		'<br />': '\n',
		'<br>': '\n',
		'`': '\'',
	};

	/**
	 * Replaces parts of a string determined by the specified object.
	 * @param {string} input The original string
	 * @param {object} dict The object literal with keys as before and values as after the replace
	 * @returns {string}
	 * @static
	 */
	public static replaceMap(input: string, dict: { [key: string]: string }): string
	{
		const regex: string[] = [];
		for (const key of Object.keys(dict))
		{
			regex.push(key.replace(/[-[\]/{}()*+?.\\^$|]/g, '\\$&'));
		}

		return input.replace(new RegExp(regex.join('|'), 'g'), (w: string) => dict[w]);
	}

	/**
	 * Splits an array into smaller chunks.
	 * The original array will not be modified.
	 * @param {T[]} input The array to split
	 * @param {number} chunkSize The size of the chunks
	 * @returns {T[][]}
	 * @static
	 */
	public static chunkArray<T = string>(input: T[], chunkSize: number): T[][]
	{
		const chunks: T[][] = [];
		const length: number = Math.ceil(input.length / chunkSize);

		for (let i: number = 0; i < length; null)
		{
			chunks.push(input.slice(i * chunkSize, ++i * chunkSize));
		}

		return chunks;
	}

	/**
	 * Formats the fuzzy dates provided from anilist. (Using timestamps is way overrated.)
	 * @param {number|string} input - The provided number, can be a string
	 * @returns {string} The formatted output
	 * @static
	 */
	public static formatFuzzy(input: number | string): string
	{
		if (!input) return '';
		if (typeof input !== 'string') input = String(input);

		return `${input.substring(6, 8)}.${input.substring(4, 6)}.${input.substring(0, 4)}`;
	}
}

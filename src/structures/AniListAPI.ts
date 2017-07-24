import { get, post, Result } from 'snekfetch';
import {  Logger } from 'yamdbf';

import { AniListPlugin } from '../AniListPlugin';
import { AniSettings } from '../types/AniSettings';
import { AniType } from '../types/AniType';
import { ClientCredentials } from '../types/ClientCredentials';

/**
 * AniListAPI class to make api calls to the AniList api.
 * (Who would have guessed)
 */
export class AniListAPI
{
	/**
	 * Reference to the client
	 * @private
	 * @readonly
	 */
	private readonly _plugin: AniListPlugin;

	/**
	 * Data to authentificate with when requiresting a new token
	 * @private
	 * @readonly
	 */
	private readonly _auth: {
		client_id: string,
		client_secret: string,
		grant_type: 'client_credentials',
	};

	/**
	 * Instantiates the AniListAPI class
	 * @param {Client} client
	 * @param {object} credentials
	 */
	public constructor(plugin: AniListPlugin, { clientId, clientSecret }: { clientId: string, clientSecret: string })
	{
		this._plugin = plugin;
		this._auth = {
			client_id: clientId,
			client_secret: clientSecret,
			grant_type: 'client_credentials',
		};
	}

	/**
	 * Searches for the requested type and returns an array of results.
	 * @param {AniType} type
	 * @param {string} search
	 * @returns {Promise<T>}
	 */
	public async search<T>(type: AniType, search: string): Promise<T[]>
	{
		const fetchType: string = AniType[type].toLowerCase();
		const token: string = await this._retrieveToken();
		search = encodeURIComponent(search);

		const url: string = `https://anilist.co/api/${fetchType}/search/${search}?access_token=${token}`;
		Logger.instance().debug('AniList', 'Requesting:', url.split('?')[0]);

		const { body }: { body: any } =
			await get(url);

		if (body.error)
		{
			if (body.error.messages[0] === 'No Results.')
			{
				return null;
			}

			throw new Error(body.error.messages.join('\n'));
		}

		return body;
	}

	/**
	 * Retrieves the access token for the AniList API, also updates it when necessary.
	 * @returns {Promise<string>}
	 * @private
	 */
	private async _retrieveToken(): Promise<string>
	{
		let settings: AniSettings = await this._plugin.client.storage.get('aniListSettings');
		if (!settings || settings.expires <= Date.now())
		{
			Logger.instance().debug('AniList', 'Refreshing token...');
			const body: ClientCredentials = await post('https://anilist.co/api/auth/access_token')
				.send(this._auth)
				.then<any>((res: Result) => res.body);

			settings = {
				expires: Date.now() + body.expires_in * 1000,
				token: body.access_token,
			};

			await this._plugin.client.storage.set('aniListSettings', settings);
		}

		return settings.token;
	}
}

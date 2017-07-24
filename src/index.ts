import { PluginConstructor } from 'yamdbf';

import { AniListPlugin } from './AniListPlugin';
import { AniCredentials } from './types';

// tslint:disable-next-line:variable-name
const AniList: (credentials: AniCredentials) => PluginConstructor = AniListPlugin.build;

export { Util } from './Util';
export { AniCredentials };
export { AniList };
export { AniListPlugin };
export default AniListPlugin.build;

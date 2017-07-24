export type AnimeData = {
	airing_status: 'finished airing'
	| 'currently airing'
	| 'not yet aired'
	| 'cancelled';
	description: string;
	duration: number;
	hashtag: string;
	list_stats: {
		completed: number;
		on_hold: number;
		dropped: number;
		plan_to_watch: number;
		watching: number;
	};
	series_type: 'anime';
	source: 'Original'
	| 'Manga'
	| 'Light Novel'
	| 'Visual Novel'
	| 'Video Game'
	| 'Other';
	total_episodes: number;
	youtube_id: string;
} & AniListAnimeAndManga;

export type CharData = {
	info: string;
	name_alt: string;
	name_first: string;
	name_japanese: string;
	name_last: string;
	role: string;
	/**
	 * For ts compatability
	 * Obviously not present here
	 */
	series_type: never;
} & AniListAllTypes;

export type MangaData = {
	description: string;
	list_stats: {
		completed: number;
		on_hold: number;
		dropped: number;
		plan_to_read: number;
		reading: number;
	};
	publishing_status: 'finished publishing'
	| 'publishing'
	| 'not yet published'
	| 'cancelled';
	series_type: 'manga';
	total_chapters: number;
	total_volumes: number;
} & AniListAnimeAndManga;

export type ScoreDistribution = {
	10: number;
	20: number;
	30: number;
	40: number;
	50: number;
	60: number;
	70: number;
	80: number;
	90: number;
	100: number;
};

// mixings
export type AniListAnimeAndManga = {
	adult: boolean;
	average_score: number;
	description: string;
	end_date_fuzzy: number;
	genres: string[];
	image_url_banner: string;
	image_url_sml: string;
	popularity: number;
	score_distribution: ScoreDistribution;
	season: number;
	start_date_fuzzy: number;
	synonyms: string[];
	title_english: string;
	title_japanese: string;
	title_romaji: string;
	type: 'TV'
	| 'TV Short'
	| 'Movie'
	| 'Special'
	| 'OVA'
	| 'ONA'
	| 'Music'
	| 'Manga'
	| 'Novel'
	| 'One Shot'
	| 'Doujin'
	| 'Manhua'
	| 'Manhwa';
	updated_at: number;
} & AniListAllTypes;

export type AniListAllTypes = {
	id: number;
	image_url_lge: string;
	image_url_med: string;
};

export interface Member {
	name: string;
	uuid: string;
	rank: string;
	contributed: number;
	joined: Date;
	joinedFriendly: string;
}

export interface BannerLayer {
	colour: string;
	pattern: string;
}

export interface Banner {
	base: string;
	tier: number;
	structure: string;
	layers: BannerLayer[];
}

export type GuildRanks = 'owner' | 'chief' | 'strategist' | 'captain' | 'recruiter' | 'recruit';
export interface Guild {
	name: string;
	prefix: string;
	level: number;
	xpPercent: number;
	territories: number;
	wars: number;
	created: string;
	members: {
		uuid: string;
		username: string;
		rank: string;
		online: boolean;
		server: string | null;
		contributed: number;
		contributionRank: number;
		joined: string;
	}[];
	online: number;
	banner: {
		base: string;
		tier: number;
		structure: string;
		layers: {
			colour: string;
			pattern: string;
		}[];
	};
	seasonRanks: {
		[rank: number]: {
			rating: number;
			finalTerritories: number;
		};
	};
}

export type PlayerScore = {
	uuid: string;
	username: string;
	rank: string;
	score: number;
	// history: number[];
	online: string | null;
	progress: {
		playtime: number;
		contributed: number;
		wars: number;
	};
};

export type MinimalPlayerScore = {
	uuid: string;
	username: string;
	score: number;
	progress: {
		playtime: number;
		contributed: number;
		wars: number;
	};
};

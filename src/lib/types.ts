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

export interface Guild {
	name: string;
	prefix: string;
	members: Member[];
	xp: number;
	level: number;
	created: Date;
	createdFriendly: string;
	territories: number;
	banner: Banner;
	request: {
		timestamp: number;
		version: number;
	};
}

export type PlayerScore = {
	uuid: string;
	username: string;
	rank: string;
	score: number;
	history: number[];
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

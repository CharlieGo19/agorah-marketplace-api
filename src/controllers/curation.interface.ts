export interface MirrorNodeNfts {
	accountId: string;
	created_timestap: string;
	delegating_spender?: string[];
	deleted: boolean;
	metadata: string;
	modified_timestap: string;
	serial_number: number;
	spender: null;
	token_id: string;
}

export interface MirrorNodeAccountNfts {
	nfts: MirrorNodeNfts[];
	links: {
		next: string | null;
	};
}

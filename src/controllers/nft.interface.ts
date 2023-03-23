export interface MirrorNodeNftSerial {
	account_id: string;
	created_timestamp: string;
	delegating_spender: null;
	deleted: boolean;
	metadata: string;
	modified_timestamp: string;
	serial_number: bigint;
	spender: null | unknown; // TODO: Find structure for this, most likely arr of accounts & ammounts
	token_id: string;
}
export interface AxiosResponseNftSerials {
	nfts: MirrorNodeNftSerial[];
	links: {
		next: string | null | undefined;
	};
}

export interface HIP412Files {
	uri: string;
	checksum?: string;
	is_default_file?: boolean;
	typemime: string;
	metadata?: string;
	metadata_uri?: string;
}

/**
 * This will contain lots of optional parameters, which will be for big projects that we'd like to onboard.
 * We will then internally move this to properties to be conformant internally with HIP-412 therefore streamlining
 * Our frontend.
 */
export type FuzzyToken = {
	name: string;
	creator: string;
	creatorDID?: string;
	description?: string;
	image?: string;
	CID?: string; // HASHAXIS token support
	checksum?: string;
	typemime: string;
	files?: HIP412Files[];
	format?: string;
	properties?: {
		attributes?: [
			{
				trait_type: string | number;
				value: string | number;
			}
		];
		copyright?: string;
		collection?: string;
	};
	localization?: string[];
	attributes?: [
		{
			trait_type: string;
			value: string | number;
		}
	];
};

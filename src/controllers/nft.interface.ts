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

// Legacy HashAxis? (unsure, this is an accusation) support, i.e. 0.0.588997 & 0.0.588870
export interface NonStandardHashAxisImage {
	type: string;
	description: string;
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
	description?: string | NonStandardHashAxisImage;
	image?: string | NonStandardHashAxisImage;
	CID?: string; // HASHAXIS token support
	checksum?: string;
	typemime: string;
	files?: HIP412Files[];
	format?: string;
	properties?: FuzzyTokenProperties | string;
	localization?: string[];
	attributes?: [
		{
			trait_type: string;
			value: string | number;
		}
	];
};

export interface FuzzyTokenProperties {
	attributes?: [
		{
			trait_type: string | number;
			value: string | number;
		}
	];
	socials?: [
		{
			platform: string;
			value: string;
		}
	];
	copyright?: string;
	collection?: string;
}

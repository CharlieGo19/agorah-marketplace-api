interface HederaKey {
	_type: string;
	key: string;
}

//TODO: change unknown
interface Royalties {
	created_timestamp: string;
	fixed_fees: unknown[];
	royalty_fees: RoyaltyFees[];
}

export interface RoyaltyFees {
	all_collectors_are_exempty: boolean;
	amount: {
		numerator: number;
		denominator: number;
	};
	fallback_fee: {
		amount: number;
		denominating_token_id: string | null;
	} | null;
	collector_account_id: string;
}
export interface AxiosResponseNftCollection {
	admin_key: HederaKey | null | undefined;
	auto_renew_account: string;
	auto_renew_period: bigint;
	created_timestamp: string;
	custom_fees: Royalties;
	decimals: string;
	deleted: boolean;
	expiry_timestamp: bigint;
	fee_schedule_key: HederaKey | null | undefined;
	freeze_default: boolean;
	freeze_key: HederaKey | null | undefined;
	initial_supply: number;
	kyc_key: HederaKey | null | undefined;
	max_supply: number;
	memo: string;
	modified_timestamp: string;
	name: string;
	pause_key: HederaKey | null | undefined;
	pause_status: string;
	supply_key: HederaKey | null | undefined;
	supply_type: string;
	symbol: string;
	token_id: string;
	total_supply: number;
	treasury_account_id: string;
	type: string;
	wipe_key: HederaKey;
}

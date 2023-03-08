export class Env {
	#expressApiPort: string;
	#mirrorProviderApiKeyI: string;
	#mirrorProviderRestApiI: string;
	#nftRequestRangeLimit: number;
	#enableStackTrace: boolean;
	#enableUserInputErrorTrace: boolean;
	#enableIpfsErrorTrace: boolean;

	constructor() {
		const dateTime: string = new Date().toUTCString();
		if (!process.env.EXPRESS_API_PORT) {
			console.log(
				`${dateTime} EXPRESS_API_PORT UNDEFINED: Setting sensible default of 4200.`
			);
			this.#expressApiPort = "4200";
		} else {
			this.#expressApiPort = process.env.EXPRESS_API_PORT;
		}

		if (!process.env.MIRROR_NODE_PROVIDER_API_KEY_I) {
			console.log(
				`${dateTime} MIRROR_NODE_PROVIDER_API_KEY_I UNDEFINED: Can not set sensible default, exiting...`
			);
			process.exit();
		} else {
			this.#mirrorProviderApiKeyI = process.env.MIRROR_NODE_PROVIDER_API_KEY_I;
		}

		if (!process.env.MIRROR_NODE_PROVIDER_REST_API_I) {
			console.log(
				`${dateTime} MIRROR_NODE_PROVIDER_REST_API_I UNDEFINED: Can not set sensible default, exiting...`
			);
			process.exit();
		} else {
			this.#mirrorProviderRestApiI = process.env.MIRROR_NODE_PROVIDER_REST_API_I;
		}

		if (!process.env.NFT_REQUEST_RANGE_LIMIT) {
			console.log(
				`${dateTime} NFT_REQUEST_RANGE_LIMIT UNDEFINED: Settings conservative default of 30.`
			);
			this.#nftRequestRangeLimit = 30;
		} else {
			this.#nftRequestRangeLimit = Number(process.env.NFT_REQUEST_RANGE_LIMIT);
		}

		if (!process.env.ENABLE_ERROR_STACK_TRACE) {
			console.log(
				`${dateTime} ENABLE_ERROR_STACK_TRACE UNDEFINED: Settings sensible default of FALSE.`
			);
			this.#enableStackTrace = false;
		} else {
			if (process.env.ENABLE_ERROR_STACK_TRACE === "true") {
				this.#enableStackTrace = true;
			} else {
				this.#enableStackTrace = false;
			}
		}

		if (!process.env.ENABLE_USER_INPUT_ERROR_TRACE) {
			console.log(
				`${dateTime} ENABLE_USER_INPUT_ERROR_TRACE UNDEFINED: Settings sensible default of FALSE.`
			);
			this.#enableUserInputErrorTrace = false;
		} else {
			if (process.env.ENABLE_USER_INPUT_ERROR_TRACE === "true") {
				this.#enableUserInputErrorTrace = true;
			} else {
				this.#enableUserInputErrorTrace = false;
			}
		}

		if (!process.env.ENABLE_IPFS_ERROR_TRACE) {
			console.log(
				`${dateTime} ENABLE_IPFS_ERROR_TRACE UNDEFINED: Settings sensible default of FALSE.`
			);
			this.#enableIpfsErrorTrace = false;
		} else {
			if (process.env.ENABLE_IPFS_ERROR_TRACE === "true") {
				this.#enableIpfsErrorTrace = true;
			} else {
				this.#enableIpfsErrorTrace = false;
			}
		}
	}
	//
	GetExpressApiPort(): string {
		return this.#expressApiPort;
	}
	GetMirrorApiKeyI(): string {
		return this.#mirrorProviderApiKeyI;
	}

	GetMirrorBaseUrlI(): string {
		return this.#mirrorProviderRestApiI;
	}

	GetNftRequestRangeLimit(): number {
		return this.#nftRequestRangeLimit;
	}

	GetEnableErrorStackTrace(): boolean {
		return this.#enableStackTrace;
	}

	GetEnableUserInputErrorInputTrace(): boolean {
		return this.#enableUserInputErrorTrace;
	}

	GetEnableIpfsErrorInputTrace(): boolean {
		return this.#enableIpfsErrorTrace;
	}
}

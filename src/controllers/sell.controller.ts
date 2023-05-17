import {
	AccountId,
	Hbar,
	TokenId,
	Transaction,
	TransactionId,
	TransferTransaction,
} from "@hashgraph/sdk";
import HbarTransferMap from "@hashgraph/sdk/lib/account/HbarTransferMap";
import TokenNftTransferMap, { NftTransfer } from "@hashgraph/sdk/lib/account/TokenNftTransferMap";
import { env, prisma } from "../index";
import { MirrorNode } from "../utils/mnode";
import { MirrorNodeNftSerial } from "./nft.interface";
import {
	AGORAH_CURRENT_NFT_LISTING_PRICE,
	AGORAH_ERROR_CODE_A1005,
	AGORAH_ERROR_CODE_A1006,
	AGORAH_ERROR_CODE_A1007,
	AGORAH_ERROR_CODE_A1008,
	AGORAH_ERROR_CODE_A1009,
	AGORAH_ERROR_CODE_A1010,
	AGORAH_ERROR_CODE_A1011,
	AGORAH_ERROR_CODE_A1012,
	AGORAH_ERROR_CODE_A1013,
	AGORAH_ERROR_CODE_A1014,
	AGORAH_ERROR_CODE_A1015,
	AGORAH_ERROR_CODE_A1016,
	AGORAH_ERROR_CODE_A1017,
	AGORAH_ERROR_CODE_A1018,
	AGORAH_ERROR_CODE_A1019,
	AGORAH_ERROR_CODE_A1020,
	AGORAH_ERROR_CODE_A1021,
	AGORAH_ERROR_MESSAGE_A1005,
	AGORAH_ERROR_MESSAGE_A1006,
	AGORAH_ERROR_MESSAGE_A1007,
	AGORAH_ERROR_MESSAGE_A1008,
	AGORAH_ERROR_MESSAGE_A1009,
	AGORAH_ERROR_MESSAGE_A1010,
	AGORAH_ERROR_MESSAGE_A1011,
	AGORAH_ERROR_MESSAGE_A1012,
	AGORAH_ERROR_MESSAGE_A1013,
	AGORAH_ERROR_MESSAGE_A1014,
	AGORAH_ERROR_MESSAGE_A1015,
	AGORAH_ERROR_MESSAGE_A1016,
	AGORAH_ERROR_MESSAGE_A1017,
	AGORAH_ERROR_MESSAGE_A1018,
	AGORAH_ERROR_MESSAGE_A1019,
	AGORAH_ERROR_MESSAGE_A1020,
	AGORAH_ERROR_MESSAGE_A1021,
	HBAR_USD_PRICE,
	HBAR_USD_PRICE_PREVIOUS,
} from "../utils/constants";
import { Decimal } from "@prisma/client/runtime/library";
import { platform_pricing } from "@prisma/client";
import List from "@hashgraph/sdk/lib/transaction/List";
import { TransactionData } from "./sell.interface";
import { AgorahError, PrismaError, ResolveAgorahError, ResolvePrismaError } from "../utils/error.handler";

export async function ListNftForSale(transactionBytes: Uint8Array): Promise<boolean | undefined> {
	transactionBytes = new Uint8Array([
		10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 7, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 250, 55, 181, 103, 32, 236, 229, 78, 47, 217, 160, 241, 172, 150, 90, 211, 238, 68, 139, 194, 237, 130, 207, 97, 233, 44, 1, 15, 226, 22, 248, 153, 34, 49, 21, 99, 89, 247, 158, 149, 44, 199, 76, 75, 171, 244, 208, 187, 154, 40, 150, 34, 109, 4, 218, 85, 217, 9, 179, 34, 169, 169, 76, 8, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 9, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 218, 113, 73, 136, 137, 69, 1, 214, 83, 111, 247, 131, 211, 107, 174, 153, 93, 82, 52, 8, 188, 201, 111, 20, 13, 187, 161, 80, 44, 194, 37, 132, 5, 166, 38, 33, 219, 11, 249, 122, 241, 39, 12, 51, 226, 179, 185, 120, 195, 113, 85, 127, 194, 162, 183, 216, 4, 44, 229, 238, 131, 71, 185, 5, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 3, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 24, 211, 168, 157, 25, 136, 237, 246, 125, 54, 150, 18, 142, 237, 48, 23, 45, 177, 190, 57, 115, 72, 48, 131, 102, 97, 2, 247, 12, 226, 12, 151, 82, 210, 125, 72, 99, 80, 232, 18, 131, 90, 147, 246, 153, 57, 74, 20, 44, 169, 200, 57, 179, 176, 57, 109, 221, 215, 120, 135, 171, 239, 112, 9, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 5, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 179, 88, 186, 168, 31, 72, 37, 237, 181, 9, 159, 68, 217, 60, 41, 6, 155, 134, 151, 131, 245, 181, 21, 207, 228, 157, 4, 107, 86, 219, 127, 3, 25, 207, 165, 134, 4, 4, 238, 182, 164, 148, 226, 114, 110, 19, 48, 83, 27, 161, 116, 133, 217, 124, 165, 156, 220, 58, 197, 111, 195, 75, 52, 14, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 3, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 24, 211, 168, 157, 25, 136, 237, 246, 125, 54, 150, 18, 142, 237, 48, 23, 45, 177, 190, 57, 115, 72, 48, 131, 102, 97, 2, 247, 12, 226, 12, 151, 82, 210, 125, 72, 99, 80, 232, 18, 131, 90, 147, 246, 153, 57, 74, 20, 44, 169, 200, 57, 179, 176, 57, 109, 221, 215, 120, 135, 171, 239, 112, 9, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 9, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 218, 113, 73, 136, 137, 69, 1, 214, 83, 111, 247, 131, 211, 107, 174, 153, 93, 82, 52, 8, 188, 201, 111, 20, 13, 187, 161, 80, 44, 194, 37, 132, 5, 166, 38, 33, 219, 11, 249, 122, 241, 39, 12, 51, 226, 179, 185, 120, 195, 113, 85, 127, 194, 162, 183, 216, 4, 44, 229, 238, 131, 71, 185, 5, 10, 244, 1, 42, 241, 1, 10, 134, 1, 10, 26, 10, 11, 8, 201, 142, 148, 163, 6, 16, 196, 166, 144, 81, 18, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 8, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 16, 255, 143, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 255, 158, 248, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 0, 94, 12, 159, 147, 13, 238, 22, 142, 242, 131, 109, 205, 204, 254, 57, 97, 197, 115, 117, 127, 238, 130, 232, 189, 110, 134, 54, 222, 54, 147, 138, 26, 64, 119, 127, 235, 110, 212, 174, 209, 236, 216, 68, 15, 62, 48, 175, 180, 254, 67, 127, 76, 7, 72, 66, 120, 249, 61, 165, 60, 111, 206, 108, 46, 205, 186, 33, 83, 158, 123, 209, 172, 149, 26, 127, 181, 162, 246, 58, 45, 76, 56, 160, 216, 86, 10, 171, 116, 165, 146, 233, 119, 241, 144, 178, 154, 6,
	]);

	const transactionDetails: TransactionData = {
		nftTokenForTransfer: undefined,
		nftSerialForTransfer: undefined,
		nftSender: undefined,
		nftReceiver: undefined,
		hbarSender: undefined,
		hbarSenderAmount: undefined,
		hbarReceiver: undefined,
		hbarReceiverAmount: undefined,
		transactionID: undefined,
		transaction: undefined,
	};

	try {
		transactionDetails.transaction = Transaction.fromBytes(
			transactionBytes
		) as TransferTransaction;
	} catch (err) {
		//throw new Error("Not valid transaction bytes.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1018, AGORAH_ERROR_MESSAGE_A1018, AGORAH_ERROR_MESSAGE_A1018);
	}
	// Deconstruct transaction object
	const transactionObject: [string, unknown][] = Object.entries(transactionDetails.transaction);
	let nftCounter = 0;
	for (const [key, value] of transactionObject) {
		if (key === "_hbarTransfers") {
			const hbarTransfers: HbarTransferMap = value as HbarTransferMap;
			const hbarTransfersObject: [string, unknown][] = Object.entries(hbarTransfers);

			if (hbarTransfersObject.length != 2) {
				//throw new Error("Not valid number hbar transfers");
				throw new AgorahError(AGORAH_ERROR_CODE_A1019, AGORAH_ERROR_MESSAGE_A1019, AGORAH_ERROR_MESSAGE_A1019);
			}

			for (const [, hbarTransferValue] of hbarTransfersObject) {
				const hbarTransfer: TransferTransaction = hbarTransferValue as TransferTransaction;
				const hbarTransferObject: [string, unknown][] = Object.entries(hbarTransfer);

				let isSender = false;
				for (const [k, v] of hbarTransferObject) {
					switch (k) {
						case "accountId":
							if (String(v) === env.GetAgorahVaultAccountId()) {
								transactionDetails.hbarReceiver = v as AccountId | undefined;
								isSender = false;
							} else {
								transactionDetails.hbarSender = v as AccountId | undefined;
								isSender = true;
							}
							break;
						case "amount":
							if (isSender) {
								transactionDetails.hbarSenderAmount = v as Hbar | undefined;
							} else {
								transactionDetails.hbarReceiverAmount = v as Hbar | undefined;
							}
							break;
					}
				}
			}
		} else if (key === "_nftTransfers") {

			const nftTransferObject: [string, unknown][] = Object.entries(
				value as TokenNftTransferMap
			);


			for (const [, value] of nftTransferObject) {
				nftCounter++;
				if (nftCounter > 1) {
					//throw new Error("More than one NFT transfer in transaction.");
					throw new AgorahError(AGORAH_ERROR_CODE_A1020, AGORAH_ERROR_MESSAGE_A1020, AGORAH_ERROR_MESSAGE_A1020);
				}
				const nftTransfer: NftTransfer = value as NftTransfer;
				const nftTransferProperties: [string, unknown][] = Object.entries(nftTransfer);

				for (const [nftTransferPropertyKey, nftTransferProperty] of nftTransferProperties) {
					switch (nftTransferPropertyKey) {
						case "tokenId":
							transactionDetails.nftTokenForTransfer = nftTransferProperty as
								| TokenId
								| undefined;
							break;
						case "senderAccountId":
							transactionDetails.nftSender = nftTransferProperty as
								| AccountId
								| undefined;
							break;
						case "receiverAccountId":
							transactionDetails.nftReceiver = nftTransferProperty as
								| AccountId
								| undefined;
							break;
						case "serialNumber":
							transactionDetails.nftSerialForTransfer = nftTransferProperty as
								| bigint
								| undefined;
							break;
					}
				}
			}
		} else if (key === "_transactionIds") {
			const ListOfTransactions: List<TransactionId> = value as List<TransactionId>;
			if (ListOfTransactions.list.length != 1) {
				//throw new Error("Invalid Transaction ID.");
				throw new AgorahError(AGORAH_ERROR_CODE_A1021, AGORAH_ERROR_MESSAGE_A1021, AGORAH_ERROR_MESSAGE_A1021);
			} else {
				transactionDetails.transactionID = ListOfTransactions.list[0];
			}
		}
	}

	try {
		const isTransactionValid: boolean | undefined = await VerifySignedSellTransaction(
			transactionDetails
		);

		if (isTransactionValid) {
			try {
				const createForSale = await prisma.nft_for_sale.create({
					data: {
						token_id: BigInt((transactionDetails.nftTokenForTransfer as TokenId).num.low),
						serial_id: BigInt(transactionDetails.nftSerialForTransfer as bigint),
						sale_price: new Decimal(Number((transactionDetails.hbarReceiverAmount as Hbar).toBigNumber())),
						seller_account: (transactionDetails.nftSender as AccountId).num.low,
					}
				});
				console.log("Nft listed for sale.")
				return true;
			} catch (error) {
				await ResolvePrismaError(error, null);
			}
		};
		/* INSERT TO DATABASE */
	} catch (err: unknown) {
		if (
			err instanceof PrismaError ||
			err instanceof AgorahError
		) {
			// Throw the err, as it's already been resolved.
			throw err;
		} else if (err instanceof Error) {
			ResolveAgorahError(err);
		}
	}
}

async function VerifySignedSellTransaction(
	transactionDetails: TransactionData
): Promise<boolean | undefined> {
	// TODO: Remove

	if (transactionDetails.transactionID?.accountId === undefined) {
		//throw new Error("Transaction ID does not have a valid Account ID.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1006, AGORAH_ERROR_MESSAGE_A1006, AGORAH_ERROR_MESSAGE_A1006);
	}

	if (
		transactionDetails.transactionID?.accountId?.toString() !==
		transactionDetails.nftSender?.toString()
	) {
		//throw new Error("Transaction ID does not match Payer Account ID.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1007, AGORAH_ERROR_MESSAGE_A1007, AGORAH_ERROR_MESSAGE_A1007);
	}

	const limitForValidPrice = new Date();
	limitForValidPrice.setHours(limitForValidPrice.getHours() - 2);

	const limitForLatestPrice = new Date();
	limitForLatestPrice.setHours(limitForLatestPrice.getHours() - 1);

	const transactionEpoch = (transactionDetails.transactionID as TransactionId).validStart
		?.toDate()
		.getTime() as number;

	if (transactionEpoch < limitForValidPrice.getTime()) {
		//throw new Error("Transaction no longer valid, AGORAH ERROR");
		throw new AgorahError(AGORAH_ERROR_CODE_A1005, AGORAH_ERROR_MESSAGE_A1005, AGORAH_ERROR_MESSAGE_A1005);
	}

	let hbar_usd_price: Decimal | undefined;
	let hbar_usd_price_last_updated: number | undefined;
	let hbar_usd_price_previous: Decimal | undefined;
	let hbar_usd_price_previous_last_updated: number | undefined;
	let list_nft_price: Decimal | undefined;

	// TODO try-catch
	const agorahSellPricing: platform_pricing[] = await prisma.platform_pricing.findMany({
		where: {
			service: {
				in: [AGORAH_CURRENT_NFT_LISTING_PRICE, HBAR_USD_PRICE, HBAR_USD_PRICE_PREVIOUS],
			},
		},
	});

	// Transaction EPOCH is valid, we can get the data from the DB.
	if (agorahSellPricing.length != 3) {
		//throw new Error("Invalid pricing data.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1008, AGORAH_ERROR_MESSAGE_A1008, AGORAH_ERROR_MESSAGE_A1008);
	}

	for (const pricing of agorahSellPricing) {
		if (pricing.service === HBAR_USD_PRICE) {
			hbar_usd_price = pricing.price;
			hbar_usd_price_last_updated = new Date(pricing.last_updated.toString()).getTime();
		}

		if (pricing.service === HBAR_USD_PRICE_PREVIOUS) {
			hbar_usd_price_previous = pricing.price;
			hbar_usd_price_previous_last_updated = new Date(
				pricing.last_updated.toString()
			).getTime();
		}

		if (pricing.service === AGORAH_CURRENT_NFT_LISTING_PRICE) {
			list_nft_price = pricing.price;
		}
	}

	if (
		hbar_usd_price === undefined ||
		hbar_usd_price_last_updated === undefined ||
		hbar_usd_price_previous === undefined ||
		hbar_usd_price_previous_last_updated === undefined ||
		list_nft_price === undefined
	) {
		//throw new Error("Pricing data not set, AGORAH ERROR");
		throw new AgorahError(AGORAH_ERROR_CODE_A1009, AGORAH_ERROR_MESSAGE_A1009, AGORAH_ERROR_MESSAGE_A1009);
	}

	if (
		transactionDetails.nftReceiver === undefined ||
		transactionDetails.nftReceiver.toString() !== env.GetAgorahVaultAccountId()
	) {
		//throw new Error("Transaction did not include a valid AGORAH Vault.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1010, AGORAH_ERROR_MESSAGE_A1010, AGORAH_ERROR_MESSAGE_A1010);
	}

	console.log(transactionDetails.hbarSender);
	console.log(transactionDetails.transactionID.accountId);
	if (
		transactionDetails.hbarSender === undefined ||
		transactionDetails.hbarSender.toString() !==
		transactionDetails.transactionID.accountId?.toString()
	) {
		//throw new Error("NftSender does not match the Transaction Payer.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1011, AGORAH_ERROR_MESSAGE_A1011, AGORAH_ERROR_MESSAGE_A1011);
	}

	if (
		transactionDetails.nftTokenForTransfer === undefined ||
		transactionDetails.nftSerialForTransfer === undefined
	) {
		//throw new Error("NFT Token transaction data incomplete.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1012, AGORAH_ERROR_MESSAGE_A1012, AGORAH_ERROR_MESSAGE_A1012);
	}

	let listing_price: Decimal = new Decimal(0);

	if (transactionEpoch >= hbar_usd_price_last_updated) {
		listing_price = Decimal.div(list_nft_price, hbar_usd_price);
	}

	if (
		transactionEpoch < hbar_usd_price_last_updated &&
		transactionEpoch >= hbar_usd_price_previous_last_updated
	) {
		listing_price = Decimal.div(list_nft_price, hbar_usd_price_previous);
	}

	// console.log(`Listing Price: ${listing_price.toString()}`);

	if (listing_price.isZero()) {
		//throw new Error("Couldn't set listing price, AGORAH ERROR");
		throw new AgorahError(AGORAH_ERROR_CODE_A1013, AGORAH_ERROR_MESSAGE_A1013, AGORAH_ERROR_MESSAGE_A1013);
	}

	if (
		transactionDetails.hbarSender === undefined &&
		transactionDetails.hbarSender !== transactionDetails.transactionID.accountId
	) {
		//throw new Error("HBar sender does not match the Transaction Payer.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1014, AGORAH_ERROR_MESSAGE_A1014, AGORAH_ERROR_MESSAGE_A1014);
	}

	if (
		transactionDetails.hbarReceiver === undefined ||
		transactionDetails.hbarReceiver.toString() !== env.GetAgorahVaultAccountId()
	) {
		//throw new Error("HBar reciever is not a valid AGORAH vault.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1015, AGORAH_ERROR_MESSAGE_A1015, AGORAH_ERROR_MESSAGE_A1015);
	}

	if (
		Number(listing_price.toString()) >
		Number((transactionDetails.hbarReceiverAmount as Hbar).toBigNumber())
	) {
		//throw new Error("Not enough HBARS to cover the NFT listing price.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1016, AGORAH_ERROR_MESSAGE_A1016, AGORAH_ERROR_MESSAGE_A1016);
	}

	if (
		Number((transactionDetails.hbarSenderAmount as Hbar).toBigNumber()) * -1 !==
		Number((transactionDetails.hbarReceiverAmount as Hbar).toBigNumber())
	) {
		//throw new Error("HBar sent and recieved do not match.");
		throw new AgorahError(AGORAH_ERROR_CODE_A1017, AGORAH_ERROR_MESSAGE_A1017, AGORAH_ERROR_MESSAGE_A1017);
	}

	return true;
}

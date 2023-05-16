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
	HBAR_USD_PRICE,
	HBAR_USD_PRICE_PREVIOUS,
} from "../utils/constants";
import { Decimal } from "@prisma/client/runtime/library";
import { platform_pricing } from "@prisma/client";
import List from "@hashgraph/sdk/lib/transaction/List";
import { TransactionData } from "./sell.interface";

export async function ListNftForSale(transactionBytes: Uint8Array): Promise<void> {
	transactionBytes = new Uint8Array([
		10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 203, 213, 143, 163, 6, 16, 242, 204,
		155, 190, 3, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 8, 24,
		128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24,
		173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155,
		160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163,
		242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160,
		247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253,
		240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187,
		91, 21, 26, 64, 114, 127, 28, 45, 145, 240, 146, 102, 14, 90, 51, 162, 200, 236, 251, 159,
		47, 250, 20, 31, 19, 221, 182, 41, 84, 47, 28, 248, 195, 115, 186, 122, 140, 239, 89, 115,
		49, 238, 49, 97, 235, 107, 50, 15, 18, 132, 205, 106, 90, 116, 121, 2, 67, 9, 88, 101, 50,
		56, 175, 79, 30, 80, 35, 7, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 203, 213,
		143, 163, 6, 16, 242, 204, 155, 190, 3, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18,
		6, 8, 0, 16, 0, 24, 6, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19,
		10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9,
		8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0,
		16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0,
		16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166,
		180, 39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84,
		235, 90, 0, 110, 187, 91, 21, 26, 64, 126, 177, 39, 201, 69, 187, 144, 77, 79, 152, 243,
		105, 206, 160, 27, 109, 119, 240, 153, 42, 0, 59, 250, 231, 219, 140, 178, 171, 157, 12,
		211, 41, 89, 72, 214, 187, 234, 26, 31, 139, 145, 162, 125, 238, 47, 14, 150, 62, 43, 127,
		23, 175, 199, 152, 25, 109, 41, 175, 82, 78, 69, 101, 100, 2, 10, 245, 1, 42, 242, 1, 10,
		135, 1, 10, 27, 10, 12, 8, 203, 213, 143, 163, 6, 16, 242, 204, 155, 190, 3, 18, 9, 8, 0,
		16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 3, 24, 128, 194, 215, 47, 34, 2,
		8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255,
		143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144,
		223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0,
		16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18,
		102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39, 9, 158,
		194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64, 73, 40,
		154, 62, 161, 74, 50, 57, 55, 179, 62, 219, 184, 81, 116, 58, 71, 208, 225, 115, 107, 70,
		229, 26, 51, 84, 29, 177, 167, 85, 8, 99, 160, 252, 40, 4, 70, 158, 95, 236, 144, 120, 121,
		75, 90, 130, 118, 129, 110, 188, 72, 132, 75, 72, 191, 230, 197, 221, 220, 242, 71, 174, 42,
		13, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 203, 213, 143, 163, 6, 16, 242,
		204, 155, 190, 3, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24,
		6, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0,
		24, 173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24,
		155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207,
		163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155,
		160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215,
		253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110,
		187, 91, 21, 26, 64, 126, 177, 39, 201, 69, 187, 144, 77, 79, 152, 243, 105, 206, 160, 27,
		109, 119, 240, 153, 42, 0, 59, 250, 231, 219, 140, 178, 171, 157, 12, 211, 41, 89, 72, 214,
		187, 234, 26, 31, 139, 145, 162, 125, 238, 47, 14, 150, 62, 43, 127, 23, 175, 199, 152, 25,
		109, 41, 175, 82, 78, 69, 101, 100, 2, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12,
		8, 203, 213, 143, 163, 6, 16, 242, 204, 155, 190, 3, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212,
		1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 7, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85,
		10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0,
		10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39,
		10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1,
		18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220,
		227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204,
		50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64, 110, 149, 85, 29, 126, 177, 117, 15, 72,
		166, 218, 59, 99, 126, 127, 226, 86, 143, 89, 104, 152, 12, 199, 148, 190, 48, 152, 94, 118,
		246, 174, 69, 147, 19, 155, 176, 217, 122, 100, 4, 11, 65, 165, 166, 48, 171, 38, 209, 177,
		57, 190, 236, 252, 91, 67, 142, 137, 59, 20, 63, 48, 15, 97, 3, 10, 245, 1, 42, 242, 1, 10,
		135, 1, 10, 27, 10, 12, 8, 203, 213, 143, 163, 6, 16, 242, 204, 155, 190, 3, 18, 9, 8, 0,
		16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 8, 24, 128, 194, 215, 47, 34, 2,
		8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255,
		143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144,
		223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0,
		16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18,
		102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39, 9, 158,
		194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64, 114, 127,
		28, 45, 145, 240, 146, 102, 14, 90, 51, 162, 200, 236, 251, 159, 47, 250, 20, 31, 19, 221,
		182, 41, 84, 47, 28, 248, 195, 115, 186, 122, 140, 239, 89, 115, 49, 238, 49, 97, 235, 107,
		50, 15, 18, 132, 205, 106, 90, 116, 121, 2, 67, 9, 88, 101, 50, 56, 175, 79, 30, 80, 35, 7,
		10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 203, 213, 143, 163, 6, 16, 242, 204,
		155, 190, 3, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 7, 24,
		128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24,
		173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155,
		160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163,
		242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160,
		247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253,
		240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187,
		91, 21, 26, 64, 110, 149, 85, 29, 126, 177, 117, 15, 72, 166, 218, 59, 99, 126, 127, 226,
		86, 143, 89, 104, 152, 12, 199, 148, 190, 48, 152, 94, 118, 246, 174, 69, 147, 19, 155, 176,
		217, 122, 100, 4, 11, 65, 165, 166, 48, 171, 38, 209, 177, 57, 190, 236, 252, 91, 67, 142,
		137, 59, 20, 63, 48, 15, 97, 3,
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
		throw new Error("Not valid transaction bytes.");
	}
	// Deconstruct transaction object
	const transactionObject: [string, unknown][] = Object.entries(transactionDetails.transaction);
	let nftCounter = 0;
	for (const [key, value] of transactionObject) {
		if (key === "_hbarTransfers") {
			const hbarTransfers: HbarTransferMap = value as HbarTransferMap;
			const hbarTransfersObject: [string, unknown][] = Object.entries(hbarTransfers);

			if (hbarTransfersObject.length != 2) {
				throw new Error("Not valid number hbar transfers");
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
			nftCounter++;
			if (nftCounter > 1) {
				throw new Error("More than one NFT transfer in transaction.");
			}

			const nftTransferObject: [string, unknown][] = Object.entries(
				value as TokenNftTransferMap
			);

			for (const [, value] of nftTransferObject) {
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
				throw new Error("Invalid Transaction ID.");
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
			console.log("Transaction is valid."); // TODO: Remove
			/* INSERT TO DATABASE */
		}
	} catch (err: unknown) {
		throw err as Error;
	}
}

async function VerifySignedSellTransaction(
	transactionDetails: TransactionData
): Promise<boolean | undefined> {
	// TODO: Remove

	if (transactionDetails.transactionID?.accountId === undefined) {
		throw new Error("Transaction ID does not have a valid Account ID.");
	}

	if (
		transactionDetails.transactionID?.accountId?.toString() !==
		transactionDetails.nftSender?.toString()
	) {
		throw new Error("Transaction ID does not match Payer Account ID.");
	}

	const limitForValidPrice = new Date();
	limitForValidPrice.setHours(limitForValidPrice.getHours() - 2);

	const limitForLatestPrice = new Date();
	limitForLatestPrice.setHours(limitForLatestPrice.getHours() - 1);

	const transactionEpoch = (transactionDetails.transactionID as TransactionId).validStart
		?.toDate()
		.getTime() as number;

	if (transactionEpoch < limitForValidPrice.getTime()) {
		throw new Error("Transaction no longer valid, AGORAH ERROR");
	}

	let hbar_usd_price: Decimal | undefined;
	let hbar_usd_price_last_updated: number | undefined;
	let hbar_usd_price_previous: Decimal | undefined;
	let hbar_usd_price_previous_last_updated: number | undefined;
	let list_nft_price: Decimal | undefined;

	const agorahSellPricing: platform_pricing[] = await prisma.platform_pricing.findMany({
		where: {
			service: {
				in: [AGORAH_CURRENT_NFT_LISTING_PRICE, HBAR_USD_PRICE, HBAR_USD_PRICE_PREVIOUS],
			},
		},
	});

	// Transaction EPOCH is valid, we can get the data from the DB.
	if (agorahSellPricing.length != 3) {
		throw new Error("Invalid pricing data.");
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
		throw new Error("Pricing data not set, AGORAH ERROR");
	}

	if (
		transactionDetails.nftReceiver === undefined ||
		transactionDetails.nftReceiver.toString() !== env.GetAgorahVaultAccountId()
	) {
		throw new Error("Transaction did not include a valid AGORAH Vault.");
	}

	if (
		transactionDetails.nftSender === undefined ||
		transactionDetails.nftSender.toString() !==
			transactionDetails.transactionID.accountId?.toString()
	) {
		throw new Error("NftSender does not match the Transaction Payer.");
	}

	if (
		transactionDetails.nftTokenForTransfer === undefined ||
		transactionDetails.nftSerialForTransfer === undefined
	) {
		throw new Error("NFT Token transaction data incomplete.");
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
		throw new Error("Couldn't set listing price, AGORAH ERROR");
	}

	if (
		transactionDetails.hbarSender === undefined &&
		transactionDetails.hbarSender !== transactionDetails.transactionID.accountId
	) {
		throw new Error("HBar sender does not match the Transaction Payer.");
	}

	if (
		transactionDetails.hbarReceiver === undefined ||
		transactionDetails.hbarReceiver.toString() !== env.GetAgorahVaultAccountId()
	) {
		throw new Error("HBar reciever is not a valid AGORAH vault.");
	}

	if (
		Number(listing_price.toString()) >
		Number((transactionDetails.hbarReceiverAmount as Hbar).toBigNumber())
	) {
		throw new Error("Not enough HBARS to cover the NFT listing price.");
	}

	if (
		Number((transactionDetails.hbarSenderAmount as Hbar).toBigNumber()) * -1 !==
		Number((transactionDetails.hbarReceiverAmount as Hbar).toBigNumber())
	) {
		throw new Error("HBar sent and recieved do not match.");
	}

	return true;
}

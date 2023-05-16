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

export async function ListNftForSale(transactionBytes: Uint8Array): Promise<void> {
	if (await VerifySignedSellTransaction(transactionBytes)) {
		console.log("Hello World!");
	} else {
		console.log("Bad transaction.");
	}
}

async function VerifySignedSellTransaction(
	transactionBytes: Uint8Array
): Promise<boolean | undefined> {
	// TODO: Remove

	transactionBytes = new Uint8Array([
		10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 228, 213, 142, 163, 6, 16, 132, 202,
		243, 146, 2, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 7, 24,
		128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24,
		173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155,
		160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163,
		242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160,
		247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253,
		240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187,
		91, 21, 26, 64, 23, 39, 131, 38, 2, 73, 20, 137, 236, 11, 53, 41, 28, 210, 153, 16, 211, 75,
		10, 241, 156, 63, 138, 243, 147, 32, 22, 179, 62, 84, 212, 199, 156, 81, 230, 65, 99, 254,
		149, 165, 50, 97, 229, 69, 3, 179, 116, 190, 6, 128, 14, 163, 39, 235, 252, 201, 113, 210,
		165, 249, 103, 51, 70, 9, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 228, 213,
		142, 163, 6, 16, 132, 202, 243, 146, 2, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18,
		6, 8, 0, 16, 0, 24, 7, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19,
		10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9,
		8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0,
		16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0,
		16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166,
		180, 39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84,
		235, 90, 0, 110, 187, 91, 21, 26, 64, 23, 39, 131, 38, 2, 73, 20, 137, 236, 11, 53, 41, 28,
		210, 153, 16, 211, 75, 10, 241, 156, 63, 138, 243, 147, 32, 22, 179, 62, 84, 212, 199, 156,
		81, 230, 65, 99, 254, 149, 165, 50, 97, 229, 69, 3, 179, 116, 190, 6, 128, 14, 163, 39, 235,
		252, 201, 113, 210, 165, 249, 103, 51, 70, 9, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27,
		10, 12, 8, 228, 213, 142, 163, 6, 16, 132, 202, 243, 146, 2, 18, 9, 8, 0, 16, 0, 24, 173,
		249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 5, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0,
		114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192,
		74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24,
		0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173,
		249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10,
		32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8,
		169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64, 36, 112, 147, 101, 143, 207,
		168, 152, 86, 112, 205, 208, 31, 105, 191, 45, 22, 59, 222, 214, 71, 171, 131, 48, 92, 159,
		230, 8, 249, 184, 150, 184, 63, 18, 155, 64, 11, 194, 217, 103, 49, 177, 207, 240, 21, 254,
		90, 174, 1, 253, 107, 44, 88, 163, 69, 79, 130, 134, 91, 93, 181, 148, 169, 3, 10, 245, 1,
		42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 228, 213, 142, 163, 6, 16, 132, 202, 243, 146, 2,
		18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 9, 24, 128, 194,
		215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249,
		212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1,
		16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26,
		10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4,
		32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39,
		9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64,
		247, 51, 158, 52, 51, 52, 236, 176, 20, 50, 247, 66, 232, 234, 69, 154, 12, 181, 12, 185,
		219, 59, 156, 10, 232, 78, 248, 173, 188, 133, 67, 194, 140, 156, 87, 54, 7, 207, 133, 182,
		191, 13, 7, 51, 136, 156, 170, 251, 73, 244, 22, 21, 136, 153, 140, 69, 0, 198, 102, 250,
		34, 205, 132, 4, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 228, 213, 142, 163,
		6, 16, 132, 202, 243, 146, 2, 18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0,
		16, 0, 24, 5, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9,
		8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0,
		16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0,
		24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0,
		24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180,
		39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90,
		0, 110, 187, 91, 21, 26, 64, 36, 112, 147, 101, 143, 207, 168, 152, 86, 112, 205, 208, 31,
		105, 191, 45, 22, 59, 222, 214, 71, 171, 131, 48, 92, 159, 230, 8, 249, 184, 150, 184, 63,
		18, 155, 64, 11, 194, 217, 103, 49, 177, 207, 240, 21, 254, 90, 174, 1, 253, 107, 44, 88,
		163, 69, 79, 130, 134, 91, 93, 181, 148, 169, 3, 10, 245, 1, 42, 242, 1, 10, 135, 1, 10, 27,
		10, 12, 8, 228, 213, 142, 163, 6, 16, 132, 202, 243, 146, 2, 18, 9, 8, 0, 16, 0, 24, 173,
		249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 3, 24, 128, 194, 215, 47, 34, 2, 8, 120, 50, 0,
		114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 16, 255, 143, 223, 192,
		74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 16, 128, 144, 223, 192, 74, 24,
		0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26, 10, 9, 8, 0, 16, 0, 24, 173,
		249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4, 32, 0, 18, 102, 10, 100, 10,
		32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39, 9, 158, 194, 79, 147, 37, 8,
		169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64, 251, 246, 248, 212, 70, 213,
		60, 124, 75, 18, 126, 116, 171, 13, 213, 28, 124, 192, 156, 227, 177, 236, 245, 40, 198, 39,
		74, 28, 16, 194, 97, 255, 3, 209, 187, 99, 107, 172, 123, 112, 125, 137, 78, 62, 156, 249,
		181, 137, 202, 118, 32, 234, 12, 127, 121, 10, 170, 80, 50, 236, 87, 251, 71, 7, 10, 245, 1,
		42, 242, 1, 10, 135, 1, 10, 27, 10, 12, 8, 228, 213, 142, 163, 6, 16, 132, 202, 243, 146, 2,
		18, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 24, 0, 18, 6, 8, 0, 16, 0, 24, 7, 24, 128, 194,
		215, 47, 34, 2, 8, 120, 50, 0, 114, 85, 10, 42, 10, 19, 10, 9, 8, 0, 16, 0, 24, 173, 249,
		212, 1, 16, 255, 143, 223, 192, 74, 24, 0, 10, 19, 10, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1,
		16, 128, 144, 223, 192, 74, 24, 0, 18, 39, 10, 9, 8, 0, 16, 0, 24, 207, 163, 242, 1, 26, 26,
		10, 9, 8, 0, 16, 0, 24, 173, 249, 212, 1, 18, 9, 8, 0, 16, 0, 24, 155, 160, 247, 1, 24, 4,
		32, 0, 18, 102, 10, 100, 10, 32, 80, 220, 227, 18, 166, 180, 39, 215, 253, 240, 189, 49, 39,
		9, 158, 194, 79, 147, 37, 8, 169, 204, 50, 148, 84, 235, 90, 0, 110, 187, 91, 21, 26, 64,
		23, 39, 131, 38, 2, 73, 20, 137, 236, 11, 53, 41, 28, 210, 153, 16, 211, 75, 10, 241, 156,
		63, 138, 243, 147, 32, 22, 179, 62, 84, 212, 199, 156, 81, 230, 65, 99, 254, 149, 165, 50,
		97, 229, 69, 3, 179, 116, 190, 6, 128, 14, 163, 39, 235, 252, 201, 113, 210, 165, 249, 103,
		51, 70, 9,
	]);

	let nftTokenForTransfer: TokenId | undefined;
	let nftSerialForTransfer: bigint | undefined;
	let nftSender: AccountId | undefined;
	let nftReceiver: AccountId | undefined;
	let hbarSender: AccountId | undefined;
	let hbarSenderAmount: Hbar | undefined;
	let hbarReceiver: AccountId | undefined;
	let hbarReceiverAmount: Hbar | undefined;
	let transactionID: TransactionId | undefined;
	let transaction: TransferTransaction;

	try {
		transaction = Transaction.fromBytes(transactionBytes) as TransferTransaction;
	} catch (err) {
		throw new Error("Not valid transaction bytes.");
	}
	// Deconstruct transaction object
	const transactionObject: [string, unknown][] = Object.entries(transaction);
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
								hbarReceiver = v as AccountId | undefined;
								isSender = false;
							} else {
								hbarSender = v as AccountId | undefined;
								isSender = true;
							}
							break;
						case "amount":
							if (isSender) {
								hbarSenderAmount = v as Hbar | undefined;
							} else {
								hbarReceiverAmount = v as Hbar | undefined;
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
							nftTokenForTransfer = nftTransferProperty as TokenId | undefined;
							break;
						case "senderAccountId":
							nftSender = nftTransferProperty as AccountId | undefined;
							break;
						case "receiverAccountId":
							nftReceiver = nftTransferProperty as AccountId | undefined;
							break;
						case "serialNumber":
							nftSerialForTransfer = nftTransferProperty as bigint | undefined;
							break;
					}
				}
			}
		} else if (key === "_transactionIds") {
			const ListOfTransactions: List<TransactionId> = value as List<TransactionId>;
			if (ListOfTransactions.list.length != 1) {
				throw new Error("Invalid Transaction ID.");
			} else {
				transactionID = ListOfTransactions.list[0];
			}
		}
	}

	if (transactionID?.accountId === undefined) {
		throw new Error("Transaction ID does not have a valid Account ID.");
	}

	if (transactionID?.accountId?.toString() !== nftSender?.toString()) {
		throw new Error("Transaction ID does not match Payer Account ID.");
	}

	const limitForValidPrice = new Date();
	limitForValidPrice.setHours(limitForValidPrice.getHours() - 2);

	const limitForLatestPrice = new Date();
	limitForLatestPrice.setHours(limitForLatestPrice.getHours() - 1);

	const transactionEpoch = (transactionID as TransactionId).validStart
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

	// console.log(`
	// Token: ${nftTokenForTransfer?.toString()}
	// Serial: ${nftSerialForTransfer?.toString()}
	// Sender: ${nftSender?.toString()} - ${transactionID.accountId?.toString()}
	// Receiver: ${nftReceiver?.toString()}
	// Hbar Sender: ${hbarSender?.toString()}
	// Hbar Sender Amount: ${hbarSenderAmount?.toString()}
	// Hbar Receiver: ${hbarReceiver?.toString()}
	// Hbar Receiver Amount: ${hbarReceiverAmount?.toString()}
	// Transaction ID: ${transactionID?.toString()}
	// Transaction Epoch: ${transactionEpoch}
	// Limit For Sale: ${limitForValidPrice.getTime()}
	// Limit For Latest Price: ${limitForLatestPrice.getTime()}

	// `);

	if (nftReceiver === undefined || nftReceiver.toString() !== env.GetAgorahVaultAccountId()) {
		throw new Error("Transaction did not include a valid AGORAH Vault.");
	}

	if (nftSender === undefined || nftSender.toString() !== transactionID.accountId?.toString()) {
		throw new Error("NftSender does not match the Transaction Payer.");
	}

	if (nftTokenForTransfer === undefined || nftSerialForTransfer === undefined) {
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

	if (hbarSender === undefined && hbarSender !== transactionID.accountId) {
		throw new Error("HBar sender does not match the Transaction Payer.");
	}

	if (hbarReceiver === undefined || hbarReceiver.toString() !== env.GetAgorahVaultAccountId()) {
		throw new Error("HBar reciever is not a valid AGORAH vault.");
	}

	if (Number(listing_price.toString()) > Number((hbarReceiverAmount as Hbar).toBigNumber())) {
		throw new Error("Not enough HBARS to cover the NFT listing price.");
	}
	console.log(
		`${Number((hbarSenderAmount as Hbar).toBigNumber()) * -1} - ${Number(
			(hbarSenderAmount as Hbar).toBigNumber()
		)}`
	);
	if (
		Number((hbarSenderAmount as Hbar).toBigNumber()) * -1 !==
		Number((hbarReceiverAmount as Hbar).toBigNumber())
	) {
		throw new Error("HBar sent and recieved do not match.");
	}

	/*****
	 *
	 * EXECUTE TRANSFER AND INSERT IN TO DB.
	 */
	return true;
}

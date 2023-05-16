import { AccountId, Hbar, TokenId, TransactionId, TransferTransaction } from "@hashgraph/sdk";

export interface TransactionData {
	nftTokenForTransfer: TokenId | undefined;
	nftSerialForTransfer: bigint | undefined;
	nftSender: AccountId | undefined;
	nftReceiver: AccountId | undefined;
	hbarSender: AccountId | undefined;
	hbarSenderAmount: Hbar | undefined;
	hbarReceiver: AccountId | undefined;
	hbarReceiverAmount: Hbar | undefined;
	transactionID: TransactionId | undefined;
	transaction: TransferTransaction | undefined;
}

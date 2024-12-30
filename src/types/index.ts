export interface TransactionData {
  amount: string;
  date: string;
  time: string;
  description: string;
  category: string;
  type: "income" | "expense";
  account: string;
  comment?: string;
  isCreditCardPayment?: boolean;
}

export interface Transaction extends TransactionData {
  id: string;
}

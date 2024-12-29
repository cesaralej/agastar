export interface TransactionData {
  amount: number;
  date: Date | null;
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

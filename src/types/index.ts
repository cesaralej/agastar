import { CategoryType } from "@/data/categories";
import { FieldValue } from "firebase/firestore";
export const ACCOUNTS = ["credit", "savings"] as const;
export const TYPES = ["income", "expense"] as const;
export type AccountType = (typeof ACCOUNTS)[number];
export type TypeCategory = (typeof TYPES)[number];

export interface TransactionData {
  //I need to keep amount as string because then I cant have the form empty at start
  amount: string;
  date: Date;
  effectiveDate: Date;
  time: string;
  description: string;
  category: CategoryType;
  type: TypeCategory;
  account: AccountType;
  comment?: string;
  isCreditCardPayment?: boolean;
}

export interface Transaction extends TransactionData {
  id: string;
}

export interface Category {
  name: string;
  icon: React.JSX.Element;
  color: string;
  hexColor: string;
}

export interface Budget {
  id: string;
  category: string;
  month: number;
  year: number;
  amount: string;
  lastUpdated?: Date | FieldValue;
}

export interface RecurringData {
  description: string;
  amount: string;
  dueDate: number;
  account: AccountType;
  lastPaymentDate?: Date;
  lastUpdated?: Date | FieldValue;
}

export interface Recurring extends RecurringData {
  id: string;
}

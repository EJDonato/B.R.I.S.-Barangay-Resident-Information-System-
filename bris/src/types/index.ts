export type TransactionType = 'Brgy Clearance' | 'Indigency' | 'Special Cert';

export interface Transaction {
  id: string;
  type: TransactionType;
  date: string;
  purpose?: string;
}

export interface Resident {
  id: string;
  name: string;
  birthday: string; // YYYY-MM-DD
  address: string;
  telephone: string;
  isVoter: boolean;
  occupation: string;
  transactions: Transaction[];
  imageUrl?: string;
}

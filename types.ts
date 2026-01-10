
import { Timestamp } from 'firebase/firestore';

export interface Company {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  photo: string;
  templateId?: 'standard' | 'minimal' | 'modern' | 'classic';
  currency?: string;
  paymentMethods?: string[];
}

export interface Customer {
  id?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export interface InvoiceItem {
  name: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Invoice {
  id?: string; // Firestore Doc ID
  invoiceId: string; // Model ID
  invoiceNo: string;
  customerId: string;
  customerName: string;
  status: string;
  date: Timestamp;
  time: string;
  paymentSystem: string;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
}

export interface UserContextType {
  user: any;
  company: Company | null;
  loading: boolean;
  refreshCompany: (uid?: string) => Promise<void>;
}

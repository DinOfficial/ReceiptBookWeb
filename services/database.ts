
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy,
  limit,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { db } from '../firebase';
import { Company, Customer, Invoice } from '../types';

// Company Services
export const getCompanyByOwner = async (uid: string): Promise<Company | null> => {
  const q = query(collection(db, 'users', uid, 'companies'), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const data = snapshot.docs[0].data();
  return { id: snapshot.docs[0].id, ...data } as Company;
};

export const createCompany = async (company: Company & { ownerUid: string }) => {
  const { ownerUid, ...companyData } = company;
  return await addDoc(collection(db, 'users', ownerUid, 'companies'), companyData);
};

export const updateCompany = async (uid: string, companyId: string, data: Partial<Company>) => {
  const docRef = doc(db, 'users', uid, 'companies', companyId);
  return await updateDoc(docRef, data);
};

// Customer Services
export const getCustomers = async (uid: string): Promise<Customer[]> => {
  const q = query(collection(db, 'users', uid, 'customers'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Customer[];
};

export const createCustomer = async (customer: Customer & { ownerUid: string }) => {
  const { ownerUid, ...customerData } = customer;
  return await addDoc(collection(db, 'users', ownerUid, 'customers'), customerData);
};

export const updateCustomer = async (uid: string, customerId: string, data: Partial<Customer>) => {
  const docRef = doc(db, 'users', uid, 'customers', customerId);
  return await updateDoc(docRef, data);
};

export const deleteCustomer = async (uid: string, customerId: string) => {
  // Cascading delete: First delete all invoices for this customer
  const invoicesRef = collection(db, 'users', uid, 'customers', customerId, 'invoices');
  const invoicesSnapshot = await getDocs(invoicesRef);
  
  const batch = writeBatch(db);
  invoicesSnapshot.docs.forEach((doc) => {
    batch.delete(doc.ref);
  });
  
  // Delete the customer document
  const customerRef = doc(db, 'users', uid, 'customers', customerId);
  batch.delete(customerRef);
  
  await batch.commit();
};

// Invoice Services
export const getInvoices = async (uid: string): Promise<Invoice[]> => {
  const customers = await getCustomers(uid);
  
  const invoicePromises = customers.map(async (customer) => {
    if (!customer.id) return [];
    const q = query(
      collection(db, 'users', uid, 'customers', customer.id, 'invoices')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Invoice));
  });

  const results = await Promise.all(invoicePromises);
  const allInvoices = results.flat();

  return allInvoices.sort((a, b) => {
    const timeA = a.date?.toMillis ? a.date.toMillis() : 0;
    const timeB = b.date?.toMillis ? b.date.toMillis() : 0;
    return timeB - timeA;
  });
};

export const getInvoiceById = async (uid: string, customerId: string, invoiceId: string): Promise<Invoice | null> => {
  const docRef = doc(db, 'users', uid, 'customers', customerId, 'invoices', invoiceId);
  const snapshot = await getDoc(docRef);
  if (!snapshot.exists()) return null;
  return { id: snapshot.id, ...snapshot.data() } as Invoice;
};

export const createInvoice = async (invoice: Omit<Invoice, 'id'>, uid: string) => {
  if (!invoice.customerId) {
    throw new Error("Cannot create invoice without a Customer ID");
  }
  return await addDoc(collection(db, 'users', uid, 'customers', invoice.customerId, 'invoices'), invoice);
};

export const deleteInvoice = async (uid: string, customerId: string, invoiceId: string) => {
  const docRef = doc(db, 'users', uid, 'customers', customerId, 'invoices', invoiceId);
  return await deleteDoc(docRef);
};

export const getLatestInvoiceNumber = async (uid: string): Promise<number> => {
  const invoices = await getInvoices(uid);
  if (invoices.length === 0) return 1000;
  
  const max = invoices.reduce((prev, current) => {
    const currentNo = parseInt(current.invoiceNo);
    const validNo = isNaN(currentNo) ? 0 : currentNo;
    return validNo > prev ? validNo : prev;
  }, 0);
  
  return max === 0 ? 1000 : max + 1;
};

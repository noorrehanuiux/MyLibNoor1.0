import { Timestamp } from 'firebase/firestore';

export interface Student {
  id: string;
  name: string;
  roll: string;
  phone: string;
  email: string;
  course: string;
  semester: string;
  session: string;
}

export interface Book {
  id: string;
  name: string;
  author: string;
  uniqueId: string;
  quantity: number;
  available: number;
}

export interface BorrowRecord {
  id: string;
  studentId: string;
  studentName: string;
  bookId: string;
  bookName: string;
  borrowDate: Timestamp;
  returnDate: Timestamp;
  status: 'borrowed' | 'returned';
}

export interface Settings {
  institutionName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  maxBooksPerStudent: number;
  maxDaysToReturn: number;
}
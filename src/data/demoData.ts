export const demoStudents = [
  {
    id: '1',
    name: 'John Doe',
    roll: 'CSE001',
    phone: '+1234567890',
    email: 'john.doe@example.com',
    course: 'Computer Science',
    semester: '6th',
    session: '2023-24',
  },
  {
    id: '2',
    name: 'Jane Smith',
    roll: 'CSE002',
    phone: '+1234567891',
    email: 'jane.smith@example.com',
    course: 'Computer Science',
    semester: '6th',
    session: '2023-24',
  },
  {
    id: '3',
    name: 'Mike Johnson',
    roll: 'EEE001',
    phone: '+1234567892',
    email: 'mike.j@example.com',
    course: 'Electrical Engineering',
    semester: '4th',
    session: '2023-24',
  },
];

export const demoBooks = [
  {
    id: '1',
    name: 'Introduction to Algorithms',
    author: 'Thomas H. Cormen',
    uniqueId: 'BOOK001',
    quantity: 5,
    available: 3,
  },
  {
    id: '2',
    name: 'Clean Code',
    author: 'Robert C. Martin',
    uniqueId: 'BOOK002',
    quantity: 3,
    available: 2,
  },
  {
    id: '3',
    name: 'Design Patterns',
    author: 'Erich Gamma',
    uniqueId: 'BOOK003',
    quantity: 4,
    available: 4,
  },
];

export const demoBorrowHistory = [
  {
    id: '1',
    studentId: '1',
    studentName: 'John Doe',
    bookId: '1',
    bookName: 'Introduction to Algorithms',
    borrowDate: new Date('2024-03-01'),
    returnDate: new Date('2024-03-15'),
    status: 'borrowed',
  },
  {
    id: '2',
    studentName: 'Jane Smith',
    studentId: '2',
    bookId: '2',
    bookName: 'Clean Code',
    borrowDate: new Date('2024-02-15'),
    returnDate: new Date('2024-03-01'),
    status: 'returned',
  },
];

export const demoSettings = {
  institutionName: 'Demo University',
  address: '123 Education Street, Knowledge City',
  phone: '+1234567890',
  email: 'contact@demouniversity.edu',
  website: 'www.demouniversity.edu',
  maxBooksPerStudent: 6,
  maxDaysToReturn: 14,
};

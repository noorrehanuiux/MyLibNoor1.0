import React, { useState, useEffect } from 'react';
import { Search, BookOpen, ArrowRight, Calendar } from 'lucide-react';
import { db } from '../firebase/config'; // Import your Firebase config
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
} from 'firebase/firestore';
import toast from 'react-hot-toast';

const BorrowReturn = () => {
  const [step, setStep] = useState(1);
  const [studentRoll, setStudentRoll] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  const [bookId, setBookId] = useState('');
  const [borrowHistory, setBorrowHistory] = useState<any[]>([]);
  const [showExtendModal, setShowExtendModal] = useState(false);
  const [selectedBorrow, setSelectedBorrow] = useState<any>(null);
  const [extendDate, setExtendDate] = useState('');

  // Fetch students from Firestore
  const fetchStudents = async (roll: string) => {
    const q = query(collection(db, 'students'), where('roll', '==', roll));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch books from Firestore (if needed)
  const fetchBooks = async () => {
    const q = query(collection(db, 'books'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  };

  // Fetch borrow history from Firestore
  const fetchBorrowHistory = async () => {
    const q = query(collection(db, 'borrowHistory'));
    const querySnapshot = await getDocs(q);
    const history = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setBorrowHistory(history);
  };

  // Use effect to fetch initial data
  useEffect(() => {
    fetchBorrowHistory();
  }, []);

  const handleStudentSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    const students = await fetchStudents(studentRoll);
    if (students.length > 0) {
      setSelectedStudent(students[0]); // Assuming roll numbers are unique
      setStep(2);
    } else {
      toast.error('Student not registered for library');
    }
  };

  const handleBorrow = async (e: React.FormEvent) => {
    e.preventDefault();
    const book = await fetchBooks(); // Modify this to get the specific book by ID if needed
    const selectedBook = book.find(
      (b) => b.uniqueId.toLowerCase() === bookId.toLowerCase()
    );
    if (!selectedBook) {
      toast.error('Book not found');
      return;
    }
    if (selectedBook.available === 0) {
      toast.error('Book not available');
      return;
    }

    const currentBorrows = borrowHistory.filter(
      (b) => b.studentId === selectedStudent.id && b.status === 'borrowed'
    );

    if (currentBorrows.length >= 6) {
      toast.error('Maximum borrow limit (6 books) reached');
      return;
    }

    const newBorrow = {
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      bookId: selectedBook.id,
      bookName: selectedBook.name,
      borrowDate: new Date(),
      returnDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      status: 'borrowed',
    };

    await addDoc(collection(db, 'borrowHistory'), newBorrow); // Add new borrow record to Firestore
    toast.success('Book borrowed successfully');
    setBookId('');
    setShowBorrowForm(false);
    fetchBorrowHistory(); // Refresh borrow history
  };

  const handleReturn = async (borrowId: string) => {
    const borrowToReturn = borrowHistory.find((b) => b.id === borrowId);
    if (borrowToReturn) {
      const borrowRef = doc(db, 'borrowHistory', borrowId);
      await updateDoc(borrowRef, {
        status: 'returned',
        returnDate: new Date(),
      });
      setBorrowHistory(
        borrowHistory.map((b) =>
          b.id === borrowId
            ? { ...b, status: 'returned', returnDate: new Date() }
            : b
        )
      );
      toast.success('Book returned successfully');
    }
  };

  const handleExtend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!extendDate) {
      toast.error('Please select a date');
      return;
    }

    const borrowRef = doc(db, 'borrowHistory', selectedBorrow.id);
    await updateDoc(borrowRef, { returnDate: new Date(extendDate) });
    setBorrowHistory(
      borrowHistory.map((b) =>
        b.id === selectedBorrow.id
          ? { ...b, returnDate: new Date(extendDate) }
          : b
      )
    );
    toast.success('Return date extended successfully');
    setShowExtendModal(false);
    setSelectedBorrow(null);
    setExtendDate('');
  };

  const currentBorrows = borrowHistory.filter(
    (b) => b.studentId === selectedStudent?.id && b.status === 'borrowed'
  );

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Borrow / Return Books
      </h1>

      {step === 1 && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold mb-4">Student Verification</h2>
          <form onSubmit={handleStudentSearch} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Student Roll Number
              </label>
              <div className="flex gap-4">
                <input
                  type="text"
                  value={studentRoll}
                  onChange={(e) => setStudentRoll(e.target.value)}
                  placeholder="Enter student roll number"
                  className="flex-1 px-4 py-2 border rounded-lg"
                  required
                />
                <button
                  type="submit"
                  className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
                >
                  <ArrowRight size={20} />
                  Next
                </button>
              </div>
            </div>
          </form>
        </div>
      )}

      {step === 2 && selectedStudent && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h2 className="text-lg font-semibold">Student Information</h2>
            <div className="mt-2 space-y-1">
              <p className="text-gray-600">Name: {selectedStudent.name}</p>
              <p className="text-gray-600">Roll: {selectedStudent.roll}</p>
              <p className="text-gray-600">Course: {selectedStudent.course}</p>
            </div>
          </div>

          {!showBorrowForm && (
            <button
              onClick={() => setShowBorrowForm(true)}
              className="mb-6 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <BookOpen size={20} />
              Borrow New Book
            </button>
          )}

          {showBorrowForm && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Borrow New Book</h3>
              <form onSubmit={handleBorrow} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Book ID
                  </label>
                  <div className="flex gap-4">
                    <input
                      type="text"
                      value={bookId}
                      onChange={(e) => setBookId(e.target.value)}
                      placeholder="Enter book ID"
                      className="flex-1 px-4 py-2 border rounded-lg"
                      required
                    />
                    <button
                      type="submit"
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Borrow
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBorrowForm(false)}
                      className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          <div>
            <h3 className="text-lg font-semibold mb-4">
              Current Borrows{' '}
              {currentBorrows.length > 0
                ? `(${currentBorrows.length}/6)`
                : '(0/6)'}
            </h3>
            {currentBorrows.length === 0 ? (
              <p className="text-gray-500">No books currently borrowed.</p>
            ) : (
              <ul className="space-y-4">
                {currentBorrows.map((borrow) => (
                  <li
                    key={borrow.id}
                    className="flex justify-between bg-gray-100 p-4 rounded-lg shadow-sm"
                  >
                    <div>
                      <p className="font-semibold">{borrow.bookName}</p>
                      <p className="text-gray-600">
                        Borrowed on:{' '}
                        {new Date(borrow.borrowDate).toLocaleDateString()}
                      </p>
                      <p className="text-gray-600">
                        Due date:{' '}
                        {new Date(borrow.returnDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      {borrow.status === 'borrowed' ? (
                        <>
                          <button
                            onClick={() => handleReturn(borrow.id)}
                            className="text-red-600 hover:text-red-700 transition-colors"
                          >
                            Return
                          </button>
                          <button
                            onClick={() => {
                              setSelectedBorrow(borrow);
                              setShowExtendModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-700 transition-colors"
                          >
                            Extend
                          </button>
                        </>
                      ) : (
                        <span className="text-green-600">Returned</span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {showExtendModal && selectedBorrow && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 shadow-md w-96">
            <h2 className="text-lg font-semibold mb-4">Extend Return Date</h2>
            <form onSubmit={handleExtend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select New Return Date
                </label>
                <input
                  type="date"
                  value={extendDate}
                  onChange={(e) => setExtendDate(e.target.value)}
                  className="px-4 py-2 border rounded-lg w-full"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                >
                  Extend
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowExtendModal(false);
                    setSelectedBorrow(null);
                  }}
                  className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BorrowReturn;

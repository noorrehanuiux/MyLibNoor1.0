import React, { useState, useEffect } from 'react';
import { Search, BookOpen, BookCheck } from 'lucide-react';
import { db } from '../firebase/config'; // Adjust the path as necessary
import { collection, getDocs } from 'firebase/firestore';
import { format } from 'date-fns';

const History = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'borrowed' | 'returned'>('all');
  const [borrowHistory, setBorrowHistory] = useState<any[]>([]); // Adjust the type as needed

  useEffect(() => {
    const fetchBorrowHistory = async () => {
      const borrowHistoryCollection = collection(db, 'borrowHistory'); // Change 'borrowHistory' to your actual collection name
      const borrowHistorySnapshot = await getDocs(borrowHistoryCollection);
      const historyData = borrowHistorySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBorrowHistory(historyData);
    };

    fetchBorrowHistory();
  }, []);

  const filteredHistory = borrowHistory.filter((record) => {
    const matchesSearch =
      record.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.bookName.toLowerCase().includes(searchTerm.toLowerCase());

    if (filter === 'all') return matchesSearch;
    return matchesSearch && record.status === filter;
  });

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Borrow History</h1>

      <div className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by student or book..."
            className="w-full px-4 py-2 border rounded-lg"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search
            className="absolute right-3 top-2.5 text-gray-400"
            size={20}
          />
        </div>
        <select
          value={filter}
          onChange={(e) =>
            setFilter(e.target.value as 'all' | 'borrowed' | 'returned')
          }
          className="px-4 py-2 border rounded-lg bg-white"
        >
          <option value="all">All</option>
          <option value="borrowed">Borrowed</option>
          <option value="returned">Returned</option>
        </select>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="divide-y divide-gray-200">
          {filteredHistory.map((record) => (
            <div key={record.id} className="p-6 flex items-center space-x-6">
              <div
                className={`p-3 rounded-full ${
                  record.status === 'borrowed'
                    ? 'bg-green-100 text-green-600'
                    : 'bg-blue-100 text-blue-600'
                }`}
              >
                {record.status === 'borrowed' ? (
                  <BookOpen size={24} />
                ) : (
                  <BookCheck size={24} />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-gray-900">
                    {record.studentName}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-sm ${
                      record.status === 'borrowed'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                    }`}
                  >
                    {record.status}
                  </span>
                </div>
                <p className="text-gray-600">{record.bookName}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span>
                    Borrowed:{' '}
                    {format(new Date(record.borrowDate.seconds * 1000), 'PPP')}
                  </span>
                  <span className="mx-2">•</span>
                  <span>
                    Return by:{' '}
                    {format(new Date(record.returnDate.seconds * 1000), 'PPP')}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;

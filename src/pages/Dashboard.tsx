import React, { useEffect, useState } from 'react';
import { Users, BookOpen, BookCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/config'; // Make sure to import your Firebase configuration

const DashboardCard = ({ title, value, icon: Icon, color }: any) => (
  <div className="bg-white rounded-lg shadow-md p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white`}>
        <Icon size={24} />
      </div>
      <div className="ml-5">
        <p className="text-gray-500 text-sm">{title}</p>
        <h3 className="text-2xl font-bold text-gray-700">{value}</h3>
      </div>
    </div>
  </div>
);

const ActivityItem = ({ action, student, book, time }: any) => (
  <div className="flex items-center space-x-4 py-3">
    <div
      className={`p-2 rounded-full ${
        action === 'borrowed'
          ? 'bg-green-100 text-green-600'
          : 'bg-blue-100 text-blue-600'
      }`}
    >
      {action === 'borrowed' ? <BookCheck size={20} /> : <BookOpen size={20} />}
    </div>
    <div className="flex-1">
      <p className="text-sm font-medium text-gray-900">{student}</p>
      <p className="text-sm text-gray-500">{`${action} "${book}"`}</p>
    </div>
    <p className="text-sm text-gray-400">{time}</p>
  </div>
);

const Dashboard = () => {
  const [totalStudents, setTotalStudents] = useState(0);
  const [availableBooks, setAvailableBooks] = useState(0);
  const [booksBorrowed, setBooksBorrowed] = useState(0);
  const [recentActivity, setRecentActivity] = useState<any[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      // Fetch students
      const studentSnapshot = await getDocs(collection(db, 'students'));
      setTotalStudents(studentSnapshot.size);

      // Fetch books
      const bookSnapshot = await getDocs(collection(db, 'books'));
      let totalAvailable = 0;
      bookSnapshot.forEach((doc) => {
        const bookData = doc.data();
        totalAvailable += bookData.available;
      });
      setAvailableBooks(totalAvailable);

      // Fetch borrow records
      const borrowSnapshot = await getDocs(collection(db, 'borrowRecords'));
      let totalBorrowed = 0;
      const activities = borrowSnapshot.docs.map((doc) => {
        const record = doc.data();
        console.log(record); // Debugging line to check data structure
        if (record.status === 'borrowed') {
          totalBorrowed++;
        }
        return {
          action: record.status,
          student: record.studentName,
          book: record.bookName,
          time: new Date(record.borrowDate.seconds * 1000).toLocaleString(),
        };
      });
      console.log("Total Borrowed Books: ", totalBorrowed); // Debugging line
      setBooksBorrowed(totalBorrowed);
      setRecentActivity(activities.slice(-5)); // Get the last 5 activities
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link
          to="/borrow"
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Borrow / Return
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Total Students"
          value={totalStudents}
          icon={Users}
          color="bg-blue-500"
        />
        <DashboardCard
          title="Available Books"
          value={availableBooks}
          icon={BookOpen}
          color="bg-green-500"
        />
        <DashboardCard
          title="Books Borrowed"
          value={booksBorrowed}
          icon={BookCheck}
          color="bg-purple-500"
        />
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Activity
          </h2>
          <Link
            to="/history"
            className="text-indigo-600 hover:text-indigo-700 text-sm"
          >
            View all
          </Link>
        </div>
        <div className="divide-y divide-gray-200">
          {recentActivity.map((activity, index) => (
            <ActivityItem key={index} {...activity} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

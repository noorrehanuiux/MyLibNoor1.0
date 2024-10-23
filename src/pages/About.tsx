import React from 'react';
import { Library, Github, Mail } from 'lucide-react';

const About = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">About MyLib1.0</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center mb-8">
          <Library size={64} className="text-indigo-600" />
        </div>

        <div className="space-y-4 text-center max-w-2xl mx-auto">
          <h2 className="text-xl font-semibold text-gray-900">MyLib1.0 Library Management System</h2>
          <p className="text-gray-600">
            Version 1.0.0
          </p>
          <p className="text-gray-600">
            A modern, efficient library management system designed to streamline the process of
            managing books, students, and borrowing records. Built with React and Firebase.
          </p>

          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Key Features</h3>
            <ul className="text-gray-600 space-y-2">
              <li>• Student Management</li>
              <li>• Book Inventory Control</li>
              <li>• Borrowing and Returns</li>
              <li>• History Tracking</li>
              <li>• Customizable Settings</li>
            </ul>
          </div>

          <div className="pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact & Support</h3>
            <div className="flex justify-center space-x-4">
              <a
                href="mailto:support@mylib.com"
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Mail size={20} className="mr-2" />
                support@mylib.com
              </a>
              <a
                href="https://github.com/mylib/mylib"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-indigo-600 hover:text-indigo-700"
              >
                <Github size={20} className="mr-2" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
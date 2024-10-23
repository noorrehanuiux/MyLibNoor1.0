import React, { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { db } from '../firebase/config'; // Adjust the path as necessary
import { doc, getDoc, setDoc } from 'firebase/firestore';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState<any>(null); // Adjust the type as needed

  useEffect(() => {
    const fetchSettings = async () => {
      const settingsDoc = doc(db, 'settings', 'institution'); // Change 'settings' and 'institution' to your actual collection and document ID
      const settingsSnapshot = await getDoc(settingsDoc);
      if (settingsSnapshot.exists()) {
        setSettings(settingsSnapshot.data());
      } else {
        // If the document doesn't exist, initialize default settings
        setSettings({
          institutionName: '',
          address: '',
          phone: '',
          email: '',
          website: '',
          maxBooksPerStudent: 1,
          maxDaysToReturn: 7,
        });
      }
    };

    fetchSettings();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newSettings = {
      institutionName: formData.get('institutionName') as string,
      address: formData.get('address') as string,
      phone: formData.get('phone') as string,
      email: formData.get('email') as string,
      website: formData.get('website') as string,
      maxBooksPerStudent: Number(formData.get('maxBooksPerStudent')),
      maxDaysToReturn: Number(formData.get('maxDaysToReturn')),
    };

    try {
      const settingsDoc = doc(db, 'settings', 'institution'); // Change to your collection and document ID
      await setDoc(settingsDoc, newSettings, { merge: true });
      setSettings(newSettings);
      toast.success('Settings updated successfully');
    } catch (error) {
      toast.error('Error updating settings');
      console.error('Error updating document: ', error);
    }
  };

  if (!settings) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>

      <div className="bg-white rounded-lg shadow-md p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Institution Name
              </label>
              <input
                type="text"
                name="institutionName"
                defaultValue={settings.institutionName}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                defaultValue={settings.address}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                defaultValue={settings.phone}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                defaultValue={settings.email}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Website
              </label>
              <input
                type="url"
                name="website"
                defaultValue={settings.website}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Books Per Student
              </label>
              <input
                type="number"
                name="maxBooksPerStudent"
                defaultValue={settings.maxBooksPerStudent}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Maximum Days to Return
              </label>
              <input
                type="number"
                name="maxDaysToReturn"
                defaultValue={settings.maxDaysToReturn}
                min="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
            >
              <Save size={20} />
              Save Settings
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;

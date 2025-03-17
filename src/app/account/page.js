'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import axios from 'axios';
import Image from 'next/image';
import { Tab } from '@headlessui/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Profile form validation schema
const profileSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  bio: z.string().optional(),
});

// Password change validation schema
const passwordSchema = z.object({
  currentPassword: z.string().min(6, { message: 'Current password is required' }),
  newPassword: z.string().min(6, { message: 'New password must be at least 6 characters' }),
  confirmPassword: z.string().min(6, { message: 'Please confirm your new password' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export default function AccountPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [userLessons, setUserLessons] = useState([]);
  const [enrolledLessons, setEnrolledLessons] = useState([]);

  // Initialize forms
  const profileForm = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: '',
      email: '',
      bio: '',
    },
  });

  const passwordForm = useForm({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    const fetchUserData = async () => {
      if (session?.user) {
        try {
          setIsLoading(true);
          const { data } = await axios.get('/api/user/profile');
          setUserData(data);

          // Set profile form defaults
          profileForm.reset({
            name: data.name || '',
            email: data.email || '',
            bio: data.bio || '',
          });

          // Fetch lessons
          const lessonsResponse = await axios.get('/api/user/lessons');
          setUserLessons(lessonsResponse.data.created || []);
          setEnrolledLessons(lessonsResponse.data.enrolled || []);
        } catch (error) {
          console.error('Error fetching user data:', error);
          toast.error('Failed to load user data');
        } finally {
          setIsLoading(false);
        }
      }
    };

    if (session?.user) {
      fetchUserData();
    }
  }, [session, profileForm]);

  // Handle profile update
  const handleProfileUpdate = async (data) => {
    try {
      setIsLoading(true);
      await axios.put('/api/user/profile', data);
      toast.success('Profile updated successfully');
      setUserData({
        ...userData,
        ...data,
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle password change
  const handlePasswordChange = async (data) => {
    try {
      setIsLoading(true);
      await axios.put('/api/user/password', {
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully');
      passwordForm.reset();
    } catch (error) {
      console.error('Error changing password:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update password'
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading' || isLoading) {
    return <div className="flex justify-center my-10">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Account</h1>

      <Tab.Group selectedIndex={activeTab} onChange={setActiveTab}>
        <Tab.List className="flex p-1 space-x-1 bg-gray-100 rounded-xl mb-8">
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg ${
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            Profile
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg ${
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            My Lessons
          </Tab>
          <Tab
            className={({ selected }) =>
              `w-full py-2.5 text-sm font-medium rounded-lg ${
                selected
                  ? 'bg-white text-indigo-700 shadow'
                  : 'text-gray-700 hover:bg-white/[0.12] hover:text-gray-800'
              }`
            }
          >
            Security
          </Tab>
        </Tab.List>

        <Tab.Panels>
          {/* Profile Panel */}
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="sm:w-1/3 mb-6 sm:mb-0">
                  <div className="flex flex-col items-center">
                    <div className="relative h-32 w-32 rounded-full overflow-hidden mb-4">
                      <Image
                        src={userData?.image || '/images/default-avatar.png'}
                        alt="Profile Picture"
                        fill
                        className="object-cover"
                      />
                    </div>
                    <button className="mt-2 text-sm text-indigo-600 hover:text-indigo-800">
                      Change Photo
                    </button>
                  </div>
                </div>

                <div className="sm:w-2/3">
                  <form onSubmit={profileForm.handleSubmit(handleProfileUpdate)}>
                    <div className="mb-4">
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        {...profileForm.register('name')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {profileForm.formState.errors.name && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        {...profileForm.register('email')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {profileForm.formState.errors.email && (
                        <p className="mt-1 text-sm text-red-600">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )}
                    </div>

                    <div className="mb-4">
                      <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                        Bio
                      </label>
                      <textarea
                        id="bio"
                        rows={4}
                        {...profileForm.register('bio')}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        placeholder="Tell us about yourself"
                      />
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        disabled={isLoading}
                        className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                      >
                        {isLoading ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </Tab.Panel>

          {/* My Lessons Panel */}
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Lessons You Created
                </h2>

                {userLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {userLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-500 mb-2">
                            {lesson.published ? 'Published' : 'Draft'}
                          </p>
                          <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                            {lesson.description || 'No description'}
                          </p>
                          <div className="flex space-x-2">
                            <a
                              href={`/lessons/${lesson.id}`}
                              className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                              View
                            </a>
                            <a
                              href={`/lessons/create?edit=${lesson.id}`}
                              className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                              Edit
                             </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">You haven't created any lessons yet.</p>
                )}
              </div>

              <div>
                <h2 className="text-xl font-semibold text-gray-900 mb-4">
                  Lessons You're Enrolled In
                </h2>

                {enrolledLessons.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {enrolledLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="border rounded-lg shadow-sm overflow-hidden"
                      >
                        <div className="p-4">
                          <h3 className="text-lg font-medium text-gray-900 mb-1">
                            {lesson.title}
                          </h3>
                          <p className="text-sm text-gray-700 line-clamp-2 mb-4">
                            {lesson.description || 'No description'}
                          </p>
                          <div className="flex space-x-2">

                              href={`/lessons/${lesson.id}`}
                              className="text-xs text-indigo-600 hover:text-indigo-800"
                            >
                              Continue Learning
                            </a>
                          </div>

                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">You're not enrolled in any lessons yet.</p>
                )}
              </div>
            </div>
          </Tab.Panel>

          {/* Security Panel */}
          <Tab.Panel>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                Change Password
              </h2>

              <form onSubmit={passwordForm.handleSubmit(handlePasswordChange)}>
                <div className="mb-4">
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
                    Current Password
                  </label>
                  <input
                    type="password"
                    id="currentPassword"
                    {...passwordForm.register('currentPassword')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="newPassword"
                    {...passwordForm.register('newPassword')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="mb-4">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    {...passwordForm.register('confirmPassword')}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="mt-1 text-sm text-red-600">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                  >
                    {isLoading ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>
            </div>
          </Tab.Panel>
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
}


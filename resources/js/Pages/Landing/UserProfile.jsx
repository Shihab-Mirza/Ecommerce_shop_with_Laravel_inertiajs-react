import { Head } from '@inertiajs/react';
import React from 'react';
import NavBar from './Navbar';
import Footer from './Footer';
import SecondaryNavBar from './SecondaryNavBar';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { useForm } from '@inertiajs/react';

export default function UserProfile({ auth, categories }) {
  const {
    data,
    setData,
    patch,
    post,
    processing,
    errors,
    reset,
  } = useForm({
    name: auth.user.name || '',
    email: auth.user.email || '',
    current_password: '',
    password: '',
    password_confirmation: '',
  });

  const resendForm = useForm();

  const updateProfile = (e) => {
    e.preventDefault();
    patch(route('profile.update'), {
      preserveScroll: true,
    });
  };

  const updatePassword = (e) => {
    e.preventDefault();
    post(route('password.update'), {
      preserveScroll: true,
      onSuccess: () => reset('current_password', 'password', 'password_confirmation'),
    });
  };

  const resendVerification = () => {
    resendForm.post(route('verification.send'), {
      preserveScroll: true,
    });
  };

  return (
    <>
      <Head title="Profile" />
      <NavBar auth={auth} />
      <SecondaryNavBar categories={categories} />

      <main className="w-full mx-auto p-6 flex space-x-4 min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        {/* User Profile Icon Sidebar */}
        <div className="w-1/5 flex justify-end items-start pr-4 mt-4">
          <div className="relative">
            <FontAwesomeIcon
              icon={faUser}
              className="text-8xl text-gray-600 opacity-80 transition-transform duration-300 hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 opacity-0 hover:opacity-20 rounded-full blur-xl transition-opacity duration-300"></div>
          </div>
        </div>

        {/* Profile Forms */}
        <div className="w-2/3 space-y-4">
          {/* Profile Information */}
          <form
            onSubmit={updateProfile}
            className="border border-gray-200 p-8 rounded-2xl shadow-lg bg-white bg-opacity-90 backdrop-blur-lg"
          >
            <fieldset>
              <legend className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Profile Information
              </legend>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                <input
                  type="text"
                  value={data.name}
                  onChange={(e) => setData('name', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="Enter your name"
                />
                {errors.name && (
                  <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.name}</div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={data.email}
                  onChange={(e) => setData('email', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="Enter your email"
                />
                {errors.email && (
                  <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.email}</div>
                )}
              </div>

              <button
                type="submit"
                disabled={processing}
                className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                Save
              </button>
            </fieldset>
          </form>

          {/* Resend Verification Email */}
          {auth.user.email_verified_at === null && (
            <div className="border border-yellow-200 p-8 rounded-2xl shadow-lg bg-yellow-50 bg-opacity-90 backdrop-blur-lg">
              <p className="mb-4 text-yellow-800 font-medium">
                Your email address is not verified.
              </p>
              <button
                onClick={resendVerification}
                className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-xl font-semibold hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                disabled={resendForm.processing}
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                Resend Verification Email
              </button>
            </div>
          )}

          {/* Update Password */}
          <form
            onSubmit={updatePassword}
            className="border border-gray-200 p-8 rounded-2xl shadow-lg bg-white bg-opacity-90 backdrop-blur-lg"
          >
            <fieldset>
              <legend className="text-2xl font-bold text-gray-800 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Update Password
              </legend>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  value={data.current_password}
                  onChange={(e) => setData('current_password', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="Enter current password"
                />
                {errors.current_password && (
                  <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.current_password}</div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  value={data.password}
                  onChange={(e) => setData('password', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="Enter new password"
                />
                {errors.password && (
                  <div className="text-red-500 text-sm mt-2 animate-pulse">{errors.password}</div>
                )}
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={data.password_confirmation}
                  onChange={(e) => setData('password_confirmation', e.target.value)}
                  className="w-full p-3 bg-gray-50 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 hover:shadow-md"
                  placeholder="Confirm new password"
                />
              </div>

              <button
                type="submit"
                disabled={processing}
                className="relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
              >
                <span className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity duration-300"></span>
                Save
              </button>
            </fieldset>
          </form>
        </div>
      </main>

      <Footer />
    </>
  );
}

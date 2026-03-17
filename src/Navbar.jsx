import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import logopfe from "./images/pmap.png"

export default function Navbar() {
  const [language, setLanguage] = useState('English');

  const languages = ['العربية', 'French', 'English'];

  return (
    <nav className="relative flex w-full flex-wrap  pt-4 items-center justify-between bg-white py-2 rounded-3xl  shadow-md lg:py-4">
      <div className="flex w-full flex-wrap items-center justify-between px-4">
        {/* Logo on the left */}
        {/* <div className="flex items-center">
          <Link
            className="flex items-center justify-center mx-2 my-1"
            to="/"
          >
            <img
              className="xs:mx-auto"
              src={logopfe}
              style={{ height: '90px', width: '160px' }}
              alt="PFE Logo"
              loading="lazy"
            />
          </Link>
        </div> */}
        {/* Right side - Auth, Contact, Language Select */}
        <div className="flex items-center space-x-4">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="appearance-none rounded border border-gray-300 bg-white px-4 py-2 pr-8 text-sm leading-tight text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
          {/* Contact */}
          <Link
            to="/contact"
            class Name="text-gray-700 transition duration-200 underline"
          >
            Contact
          </Link>
          {/* Language Selector */}

          {/* Login */}
          <Link
            to="/login"
            className="rounded px-4 py-2 text-m font-bold text-green-900 transition duration-200 hover:text-gray-800"
          >
            Login
          </Link>

          {/* Sign Up */}
          <Link
            to="/signup"
            className="rounded bg-green-900 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:bg-green-500"
          >
            Sign Up
          </Link>


        </div>
      </div>
    </nav>
  );
}
// components/Header.jsx
"use client"

import { useEffect } from "react";
import Link from "next/link";
import { useSession, signOut, __NEXTAUTH } from "next-auth/react";

export default function Header() {
  const { data: session, status } = useSession();

  useEffect(() => {
    __NEXTAUTH.basePath = "/api/auth";
  }, []);


  const handleLogout = () => {
    __NEXTAUTH.basePath = "/api/auth";
    signOut({
      callbackUrl: "/login"
    })
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex h-20 items-center justify-between">

          {/* Logo */}

          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-800">
              Resort.Com
            </span>
          </Link>


          {/* Navigation */}

          <nav className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>

            <Link href="/resorts" className="text-gray-700 hover:text-blue-600">
              Resorts
            </Link>


            <Link href="/bookings" className="text-gray-700 hover:text-blue-600">
              My Bookings
            </Link>


            <Link href="/about" className="text-gray-700 hover:text-blue-600">
              About
            </Link>

            <Link href="/contacts" className="text-gray-700 hover:text-blue-600">
              Contact
            </Link>
          </nav>


          {/* Buttons */}
          <div className="flex items-center gap-4">
            {status === "loading" ? (
              <span className="text-sm text-gray-500">Loading...</span>
            ) : session ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-gray-700">
                  Welcome, {session?.user?.username || session?.user?.name}
                </span>
                <button
                  onClick={() => handleLogout()}
                  className="rounded-lg border border-red-600 px-4 py-2 text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block text-gray-700 hover:text-blue-600"
                >
                  Login
                </Link>

                <Link
                  href="/register"
                  className="rounded-lg border border-blue-600 px-4 py-2 text-blue-600 hover:bg-blue-50 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
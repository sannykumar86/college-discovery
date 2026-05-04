import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, GraduationCap, Bookmark, AlignLeft } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo + Desktop Nav */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center gap-2 mr-8">
              <GraduationCap className="h-8 w-8 text-emerald-600" />
              <span className="font-bold text-xl tracking-tight text-slate-900 hidden sm:block">
                Campus Finder
              </span>
            </Link>
            <div className="hidden sm:flex sm:space-x-8">
              <Link
                to="/colleges"
                className="border-transparent text-slate-600 hover:text-emerald-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Explore
              </Link>
              <Link
                to="/compare"
                className="border-transparent text-slate-600 hover:text-emerald-600 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium transition-colors"
              >
                Compare
              </Link>
            </div>
          </div>

          {/* Desktop Auth */}
          <div className="hidden sm:flex sm:items-center sm:gap-4">
            {user ? (
              <>
                <Link to="/saved" className="text-slate-500 hover:text-emerald-600 transition-colors" title="Saved Colleges">
                  <Bookmark className="h-5 w-5" />
                </Link>
                <div className="flex items-center gap-2 pl-4 border-l border-slate-200">
                  <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="ml-2 text-slate-400 hover:text-red-500 transition-colors"
                    title="Logout"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">
                  Log in
                </Link>
                <Link to="/register" className="btn-primary ml-2 text-sm">
                  Sign up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              <AlignLeft className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden bg-white border-b border-slate-200">
          <div className="pt-2 pb-3 space-y-1">
            <Link
              to="/colleges"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              Explore
            </Link>
            <Link
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-slate-600 hover:bg-slate-50 hover:border-emerald-500 hover:text-emerald-700"
            >
              Compare
            </Link>
          </div>
          <div className="pt-4 pb-3 border-t border-slate-200">
            {user ? (
              <>
                <div className="flex items-center px-4">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-lg">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="ml-3">
                    <div className="text-base font-medium text-slate-800">{user.name}</div>
                    <div className="text-sm font-medium text-slate-500">{user.email}</div>
                  </div>
                </div>
                <div className="mt-3 space-y-1">
                  <Link
                    to="/saved"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    Saved Colleges
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-base font-medium text-slate-500 hover:text-slate-800 hover:bg-slate-100"
                  >
                    Sign out
                  </button>
                </div>
              </>
            ) : (
              <div className="mt-3 space-y-1 px-4 flex flex-col gap-2">
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-secondary text-center w-full">
                  Log in
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-primary text-center w-full">
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

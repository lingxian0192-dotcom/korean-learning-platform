import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { BookOpen, User as UserIcon, Languages, LogIn, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';

export const MainLayout: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { isAuthenticated, user, logout } = useAuth();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-indigo-600">{t('app.title')}</span>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/resources"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {t('app.nav.resources')}
                </Link>
                {/* Admin Link - For demo showing to all logged in users or specifically admins */}
                {isAuthenticated && (
                  <Link
                    to="/admin/resources"
                    className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    {t('admin.title')}
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex items-center"
                title="Switch Language"
              >
                <Languages className="w-5 h-5" />
                <span className="ml-1 text-sm font-medium">{i18n.language === 'zh' ? 'EN' : '中文'}</span>
              </button>
              
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm text-gray-700">{user?.name}</span>
                  <button 
                    onClick={logout}
                    className="p-2 rounded-full text-gray-400 hover:text-gray-500"
                    title="Logout"
                  >
                    <UserIcon className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/auth/login"
                  className="p-2 rounded-full text-gray-400 hover:text-gray-500 flex items-center"
                  title="Login"
                >
                  <LogIn className="w-6 h-6" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

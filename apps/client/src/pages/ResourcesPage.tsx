import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Resource } from '../types';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ResourcesPage: React.FC = () => {
  const { t } = useTranslation();
  const { data: resources, isLoading, error } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get('/resources');
      return data;
    },
  });

  if (isLoading) return <div>{t('resources.loading')}</div>;
  if (error) return <div>{t('resources.error')}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{t('resources.title')}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {resources?.map((resource) => (
          <div key={resource.id} className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow">
            {resource.thumbnail && (
              <img src={resource.thumbnail} alt={resource.title} className="w-full h-48 object-cover" />
            )}
            <div className="p-5">
              <div className="flex items-center justify-between mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${resource.type === 'video' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {t(`resources.type.${resource.type}`)}
                </span>
                <span className="text-xs text-gray-500">{t(`resources.difficulty.${resource.difficulty}`)}</span>
              </div>
              <h3 className="text-lg font-medium text-gray-900 truncate">{resource.title}</h3>
              <p className="mt-1 text-sm text-gray-500 line-clamp-2">{resource.description}</p>
              <div className="mt-4">
                <Link 
                  to={`/resources/${resource.id}`}
                  className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                >
                  {t('resources.start_learning')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}

        {resources?.length === 0 && (
          <div className="col-span-full text-center py-12 text-gray-500">
            {t('resources.no_resources')}
          </div>
        )}
      </div>
    </div>
  );
};

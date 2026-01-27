import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import ReactMarkdown from 'react-markdown';
import { ArrowLeft, CheckCircle, Circle } from 'lucide-react';
import { api } from '../lib/api';
import { Resource } from '../types';
import { useAuth } from '../contexts/AuthContext';

export const ResourceDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { t } = useTranslation();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [progress, setProgress] = useState(0);

  const { data: resource, isLoading, error } = useQuery<Resource>({
    queryKey: ['resource', id],
    queryFn: async () => {
      const { data } = await api.get(`/resources/${id}`);
      return data;
    },
  });

  const { data: userProgress } = useQuery({
    queryKey: ['progress', id, user?.id],
    queryFn: async () => {
      if (!user) return null;
      try {
        const { data } = await api.get(`/progress/${id}/user/${user.id}`);
        return data;
      } catch (e) {
        return null;
      }
    },
    enabled: !!user && !!id,
  });

  useEffect(() => {
    if (userProgress) {
      setProgress(userProgress.progress);
    }
  }, [userProgress]);

  const progressMutation = useMutation({
    mutationFn: async (newProgress: number) => {
      if (!user) return;
      await api.post(`/progress/${id}`, { 
        progress: newProgress,
        userId: user.id // For demo purposes
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['progress', id] });
    },
  });

  const handleComplete = () => {
    setProgress(100);
    progressMutation.mutate(100);
  };

  if (isLoading) return <div>{t('common.loading')}</div>;
  if (error || !resource) return <div>{t('resources.error')}</div>;

  const renderContent = () => {
    if (resource.type === 'video') {
      // Simple YouTube embed extraction (demo)
      return (
        <div className="aspect-w-16 aspect-h-9 bg-gray-900 rounded-lg overflow-hidden shadow-lg">
          <iframe 
            src={resource.content} 
            title={resource.title}
            className="w-full h-[500px]"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      );
    } else {
      return (
        <div className="prose prose-indigo max-w-none bg-white p-8 rounded-lg shadow">
          <ReactMarkdown>{resource.content}</ReactMarkdown>
        </div>
      );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/resources" className="inline-flex items-center text-indigo-600 hover:text-indigo-900 mb-6">
        <ArrowLeft className="w-4 h-4 mr-2" />
        {t('detail.back')}
      </Link>

      <div className="bg-white shadow rounded-lg overflow-hidden mb-8">
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <span className={`px-2 py-1 text-xs font-semibold rounded-full 
                  ${resource.type === 'video' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                  {t(`resources.type.${resource.type}`)}
                </span>
                <span className="text-xs text-gray-500">{t(`resources.difficulty.${resource.difficulty}`)}</span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900">{resource.title}</h1>
              <p className="mt-2 text-gray-600">{resource.description}</p>
            </div>
            {user && (
              <div className="flex flex-col items-end">
                 <div className="text-sm text-gray-500 mb-2">{t('detail.progress')}: {progress}%</div>
                 <button
                   onClick={handleComplete}
                   disabled={progress >= 100}
                   className={`flex items-center px-4 py-2 rounded-md text-sm font-medium
                     ${progress >= 100 
                       ? 'bg-green-100 text-green-800 cursor-default' 
                       : 'bg-indigo-600 text-white hover:bg-indigo-700'}`}
                 >
                   {progress >= 100 ? (
                     <><CheckCircle className="w-4 h-4 mr-2" /> {t('detail.completed')}</>
                   ) : (
                     <><Circle className="w-4 h-4 mr-2" /> {t('detail.complete')}</>
                   )}
                 </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {renderContent()}
    </div>
  );
};

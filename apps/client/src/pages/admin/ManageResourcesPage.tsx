import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import { Plus, Trash2, Edit2, X } from 'lucide-react';
import { api } from '../../lib/api';
import { Resource } from '../../types';

export const ManageResourcesPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const { register, handleSubmit, reset, setValue } = useForm();

  const { data: resources, isLoading } = useQuery<Resource[]>({
    queryKey: ['resources'],
    queryFn: async () => {
      const { data } = await api.get('/resources');
      return data;
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.post('/resources', data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      resetForm();
    },
  });

  const updateMutation = useMutation({
    mutationFn: async (data: any) => {
      await api.patch(`/resources/${editingId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/resources/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resources'] });
    },
  });

  const onSubmit = (data: any) => {
    if (editingId) {
      updateMutation.mutate(data);
    } else {
      createMutation.mutate(data);
    }
  };

  const handleEdit = (resource: Resource) => {
    setIsEditing(true);
    setEditingId(resource.id);
    setValue('title', resource.title);
    setValue('type', resource.type);
    setValue('category', resource.category);
    setValue('difficulty', resource.difficulty);
    setValue('description', resource.description);
    setValue('content', resource.content);
    setValue('thumbnail', resource.thumbnail);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(t('admin.delete_confirm'))) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    reset();
  };

  if (isLoading) return <div>{t('common.loading')}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">{t('admin.title')}</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.add_resource')}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
              {editingId ? t('admin.edit_resource') : t('admin.add_resource')}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
              <X className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.form.title')}</label>
                <input {...register('title', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.form.category')}</label>
                <input {...register('category', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.form.type')}</label>
                <select {...register('type')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="video">Video</option>
                  <option value="article">Article</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.form.difficulty')}</label>
                <select {...register('difficulty')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('admin.form.description')}</label>
              <textarea {...register('description')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('admin.form.content')}</label>
              <textarea {...register('content')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={5} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">{t('admin.form.thumbnail')}</label>
              <input {...register('thumbnail')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex justify-end">
              <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('admin.form.cancel')}
              </button>
              <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                {t('admin.form.submit')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {resources?.map((resource) => (
            <li key={resource.id}>
              <div className="px-4 py-4 flex items-center justify-between sm:px-6">
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">{resource.title}</p>
                    <div className="ml-2 flex-shrink-0 flex">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        {resource.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex justify-between">
                    <div className="sm:flex">
                      <p className="flex items-center text-sm text-gray-500">
                        {resource.category}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="ml-5 flex-shrink-0 flex space-x-2">
                  <button onClick={() => handleEdit(resource)} className="text-gray-400 hover:text-gray-500">
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button onClick={() => handleDelete(resource.id)} className="text-red-400 hover:text-red-500">
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

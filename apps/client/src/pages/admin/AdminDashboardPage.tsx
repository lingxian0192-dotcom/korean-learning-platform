import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, X, Key, Activity, BookOpen, Copy, Settings } from 'lucide-react';
import { api } from '../../lib/api';
import { Resource } from '../../types';

// --- Sub-components for Tabs ---

const ResourcesTab: React.FC = () => {
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
    if (window.confirm(t('admin.resources.delete_confirm'))) {
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
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">{t('admin.resources.title')}</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          {t('admin.resources.add_button')}
        </button>
      </div>

      {isEditing && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
                {editingId ? t('admin.resources.edit_title') : t('admin.resources.add_title')}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
            </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.title')}</label>
                <input {...register('title', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.category')}</label>
                <input {...register('category', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.type')}</label>
                <select {...register('type')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="video">{t('resources.type.video')}</option>
                    <option value="article">{t('resources.type.article')}</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.difficulty')}</label>
                <select {...register('difficulty')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="beginner">{t('resources.difficulty.beginner')}</option>
                    <option value="intermediate">{t('resources.difficulty.intermediate')}</option>
                    <option value="advanced">{t('resources.difficulty.advanced')}</option>
                </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.description')}</label>
                <textarea {...register('description')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.content')}</label>
                <textarea {...register('content')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={5} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">{t('admin.resources.form.thumbnail')}</label>
                <input {...register('thumbnail')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                {t('admin.resources.form.cancel')}
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                {t('admin.resources.form.submit')}
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

const InvitationsTab: React.FC = () => {
    const { t } = useTranslation();
    const queryClient = useQueryClient();
    const [generateCount, setGenerateCount] = useState(1);
    
    const { data: invitations, isLoading } = useQuery<any[]>({
        queryKey: ['invitations'],
        queryFn: async () => {
            const { data } = await api.get('/invitation');
            return data;
        },
    });

    const generateMutation = useMutation({
        mutationFn: async (count: number) => {
            await api.post('/invitation/generate', { count });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['invitations'] });
        },
    });

    const handleGenerate = () => {
        generateMutation.mutate(generateCount);
    };

    const copyToClipboard = (code: string) => {
        navigator.clipboard.writeText(code);
        alert(t('admin.invitations.copied'));
    };

    if (isLoading) return <div>{t('admin.invitations.loading')}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{t('admin.invitations.title')}</h2>
                <div className="flex items-center space-x-2">
                    <input 
                        type="number" 
                        min="1" 
                        max="100" 
                        value={generateCount} 
                        onChange={(e) => setGenerateCount(parseInt(e.target.value))}
                        className="w-20 border border-gray-300 rounded-md p-2"
                    />
                    <button
                        onClick={handleGenerate}
                        className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                    >
                        <Plus className="w-4 h-4 mr-2" />
                        {t('admin.invitations.generate')}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.invitations.table.code')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.invitations.table.status')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.invitations.table.used_by')}</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('admin.invitations.table.actions')}</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {invitations?.map((invite) => (
                            <tr key={invite.code}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-mono font-medium text-gray-900">{invite.code}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                        invite.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                    }`}>
                                        {invite.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {invite.profiles ? invite.profiles.id : '-'}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => copyToClipboard(invite.code)} className="text-indigo-600 hover:text-indigo-900">
                                        <Copy className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const MonitoringTab: React.FC = () => {
    const { t } = useTranslation();
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('admin.monitoring.title')}</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.monitoring.server_status')}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{t('admin.monitoring.online')}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.monitoring.database')}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">{t('admin.monitoring.connected')}</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">{t('admin.monitoring.ai_tokens')}</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">--</dd>
                        <p className="text-xs text-gray-400 mt-2">{t('admin.monitoring.check_logs')}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

const SettingsTab: React.FC = () => {
    const { t } = useTranslation();
    const { register, handleSubmit } = useForm();
    const queryClient = useQueryClient();

    const { data: settings, isLoading } = useQuery({
        queryKey: ['settings', 'api-key'],
        queryFn: async () => {
            // Mock or actual implementation pending
             try {
                const { data } = await api.get('/settings/api-key');
                return data;
            } catch (e) {
                return { apiKey: '' };
            }
        },
    });

    const mutation = useMutation({
        mutationFn: async (data: { apiKey: string }) => {
            await api.post('/settings/api-key', data);
        },
        onSuccess: () => {
            alert(t('admin.settings.success'));
            queryClient.invalidateQueries({ queryKey: ['settings', 'api-key'] });
        },
        onError: () => {
            alert(t('admin.settings.error'));
        }
    });

    const onSubmit = (data: any) => {
        mutation.mutate(data);
    };

    if (isLoading) return <div>{t('admin.settings.loading')}</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">{t('admin.settings.title')}</h2>
            <div className="bg-white shadow sm:rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                    <form onSubmit={handleSubmit(onSubmit)} className="mt-5 space-y-4">
                        <div className="max-w-xl">
                            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700">
                                {t('admin.settings.api_key_label')}
                            </label>
                            <div className="mt-1">
                                <input
                                    type="password"
                                    id="api-key"
                                    defaultValue={settings?.apiKey}
                                    {...register('apiKey')}
                                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
                                    placeholder={t('admin.settings.api_key_placeholder')}
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            {t('admin.settings.save')}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

// --- Main Page Component ---

export const AdminDashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'resources' | 'invitations' | 'monitoring' | 'settings'>('resources');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">{t('admin.title')}</h1>
      
      {/* Tabs */}
      <div className="border-b border-gray-200 mb-8">
        <nav className="-mb-px flex space-x-8">
            <button
                onClick={() => setActiveTab('resources')}
                className={`${
                  activeTab === 'resources'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
                <BookOpen className="w-4 h-4 mr-2" />
                {t('admin.tabs.resources')}
            </button>
            <button
                onClick={() => setActiveTab('invitations')}
                className={`${
                  activeTab === 'invitations'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
                <Key className="w-4 h-4 mr-2" />
                {t('admin.tabs.invitations')}
            </button>
            <button
                onClick={() => setActiveTab('monitoring')}
                className={`${
                  activeTab === 'monitoring'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
                <Activity className="w-4 h-4 mr-2" />
                {t('admin.tabs.monitoring')}
            </button>
            <button
                onClick={() => setActiveTab('settings')}
                className={`${
                  activeTab === 'settings'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
                <Settings className="w-4 h-4 mr-2" />
                {t('admin.tabs.settings')}
            </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'resources' && <ResourcesTab />}
      {activeTab === 'invitations' && <InvitationsTab />}
      {activeTab === 'monitoring' && <MonitoringTab />}
      {activeTab === 'settings' && <SettingsTab />}
    </div>
  );
};

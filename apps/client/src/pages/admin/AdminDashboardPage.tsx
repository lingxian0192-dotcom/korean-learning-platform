import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, X, Key, Activity, BookOpen, Copy } from 'lucide-react';
import { api } from '../../lib/api';
import { Resource } from '../../types';

// --- Sub-components for Tabs ---

const ResourcesTab: React.FC = () => {
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
    if (window.confirm('Are you sure you want to delete this resource?')) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setIsEditing(false);
    setEditingId(null);
    reset();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Resource Management</h2>
        <button
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Resource
        </button>
      </div>

      {isEditing && (
        <div className="bg-white shadow rounded-lg p-6 mb-8">
            <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">
                {editingId ? 'Edit Resource' : 'Add Resource'}
            </h2>
            <button onClick={resetForm} className="text-gray-400 hover:text-gray-500">
                <X className="w-5 h-5" />
            </button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input {...register('title', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input {...register('category', { required: true })} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select {...register('type')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="video">Video</option>
                    <option value="article">Article</option>
                </select>
                </div>
                <div>
                <label className="block text-sm font-medium text-gray-700">Difficulty</label>
                <select {...register('difficulty')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2">
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea {...register('description')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={3} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Content</label>
                <textarea {...register('content')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" rows={5} />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Thumbnail URL</label>
                <input {...register('thumbnail')} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" />
            </div>
            <div className="flex justify-end">
                <button type="button" onClick={resetForm} className="mr-3 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
                </button>
                <button type="submit" className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                Submit
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
        alert('Copied to clipboard');
    };

    if (isLoading) return <div>Loading codes...</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Invitation Codes</h2>
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
                        Generate
                    </button>
                </div>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Code</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Used By</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
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
    return (
        <div className="space-y-6">
            <h2 className="text-xl font-bold">System Monitoring</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Server Status</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">Online</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">Database</dt>
                        <dd className="mt-1 text-3xl font-semibold text-green-600">Connected</dd>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="px-4 py-5 sm:p-6">
                        <dt className="text-sm font-medium text-gray-500 truncate">AI Tokens Today</dt>
                        <dd className="mt-1 text-3xl font-semibold text-gray-900">--</dd>
                        <p className="text-xs text-gray-400 mt-2">Check Supabase for exact usage logs</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- Main Page Component ---

export const AdminDashboardPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'resources' | 'invitations' | 'monitoring'>('resources');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
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
                Resources
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
                Invitations
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
                Monitoring
            </button>
        </nav>
      </div>

      {/* Content */}
      {activeTab === 'resources' && <ResourcesTab />}
      {activeTab === 'invitations' && <InvitationsTab />}
      {activeTab === 'monitoring' && <MonitoringTab />}
    </div>
  );
};

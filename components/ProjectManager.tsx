'use client';
import { useState, useEffect } from 'react';
import {
  getAllProjects,
  loadProject,
  deleteProject,
  SavedProject,
  getStorageInfo,
} from '@/lib/storage/localStorage';

interface ProjectManagerProps {
  onLoadProject: (project: SavedProject) => void;
  onClose: () => void;
}

export default function ProjectManager({ onLoadProject, onClose }: ProjectManagerProps) {
  const [projects, setProjects] = useState<
    Array<{
      id: string;
      name: string;
      thumbnail?: string;
      createdAt: string;
      updatedAt: string;
    }>
  >([]);
  const [storageInfo, setStorageInfo] = useState({ used: 0, available: false, projectCount: 0 });
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = () => {
    const allProjects = getAllProjects();
    setProjects(allProjects);
    setStorageInfo(getStorageInfo());
  };

  const handleLoadProject = (id: string) => {
    const project = loadProject(id);
    if (project) {
      onLoadProject(project);
      onClose();
    }
  };

  const handleDeleteProject = (id: string) => {
    if (confirm('Are you sure you want to delete this project?')) {
      deleteProject(id);
      loadProjects();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Projects</h2>
            <p className="text-sm text-gray-600 mt-1">
              {storageInfo.projectCount} saved project(s) • {formatBytes(storageInfo.used)} used
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ×
          </button>
        </div>

        {/* Projects List */}
        <div className="flex-1 overflow-y-auto p-6">
          {projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📁</div>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No saved projects</h3>
              <p className="text-gray-500">
                Projects you save will appear here. Create your first project to get started!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md ${
                    selectedProject === project.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                  onClick={() => setSelectedProject(project.id)}
                >
                  {/* Thumbnail */}
                  {project.thumbnail ? (
                    <div className="w-full h-32 mb-3 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={project.thumbnail}
                        alt={project.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-full h-32 mb-3 bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                  )}

                  {/* Project Info */}
                  <h3 className="font-semibold text-gray-800 mb-1 truncate">{project.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">
                    Updated: {formatDate(project.updatedAt)}
                  </p>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLoadProject(project.id);
                      }}
                      className="flex-1 px-3 py-1.5 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                    >
                      Load
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteProject(project.id);
                      }}
                      className="px-3 py-1.5 bg-red-500 text-white rounded text-sm hover:bg-red-600 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 bg-gray-50 flex justify-between items-center">
          <div className="text-sm text-gray-600">
            {storageInfo.available ? (
              <span>LocalStorage available</span>
            ) : (
              <span className="text-red-600">LocalStorage not available</span>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

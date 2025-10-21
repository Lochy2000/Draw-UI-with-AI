/**
 * LocalStorage utilities for saving and loading projects
 * Provides client-side persistence without requiring a database
 */

import { ComponentSuggestion, WebsiteComponent } from '@/types/components';

export interface SavedProject {
  id: string;
  name: string;
  thumbnail?: string; // base64 image
  sketchData?: any; // tldraw snapshot
  visionAnalysis?: any;
  layoutAnalysis?: any;
  suggestions?: ComponentSuggestion[];
  components?: WebsiteComponent[];
  html?: string;
  css?: string;
  javascript?: string;
  createdAt: string;
  updatedAt: string;
}

const STORAGE_PREFIX = 'ai-website-builder-';
const PROJECTS_KEY = `${STORAGE_PREFIX}projects`;
const AUTO_SAVE_KEY = `${STORAGE_PREFIX}auto-save`;

/**
 * Check if localStorage is available
 */
export function isLocalStorageAvailable(): boolean {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Get all saved projects metadata (without full data)
 */
export function getAllProjects(): Array<{
  id: string;
  name: string;
  thumbnail?: string;
  createdAt: string;
  updatedAt: string;
}> {
  if (!isLocalStorageAvailable()) return [];

  try {
    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    if (!projectsJson) return [];

    const projects = JSON.parse(projectsJson);
    return projects.sort((a: SavedProject, b: SavedProject) =>
      new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  } catch (error) {
    console.error('Error loading projects list:', error);
    return [];
  }
}

/**
 * Save a project
 */
export function saveProject(project: Omit<SavedProject, 'id' | 'createdAt' | 'updatedAt'>): string {
  if (!isLocalStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  try {
    const projects = getAllProjects();
    const now = new Date().toISOString();
    const id = `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newProject: SavedProject = {
      ...project,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Save full project data
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(newProject));

    // Update projects list (metadata only)
    const projectMetadata = {
      id: newProject.id,
      name: newProject.name,
      thumbnail: newProject.thumbnail,
      createdAt: newProject.createdAt,
      updatedAt: newProject.updatedAt,
    };

    projects.push(projectMetadata);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));

    return id;
  } catch (error) {
    console.error('Error saving project:', error);
    throw new Error('Failed to save project. Storage may be full.');
  }
}

/**
 * Update an existing project
 */
export function updateProject(id: string, updates: Partial<SavedProject>): void {
  if (!isLocalStorageAvailable()) {
    throw new Error('LocalStorage is not available');
  }

  try {
    const project = loadProject(id);
    if (!project) {
      throw new Error('Project not found');
    }

    const updatedProject: SavedProject = {
      ...project,
      ...updates,
      id, // Don't allow ID to be changed
      createdAt: project.createdAt, // Don't allow creation date to be changed
      updatedAt: new Date().toISOString(),
    };

    // Save updated project
    localStorage.setItem(`${STORAGE_PREFIX}${id}`, JSON.stringify(updatedProject));

    // Update metadata in projects list
    const projects = getAllProjects();
    const index = projects.findIndex(p => p.id === id);
    if (index !== -1) {
      projects[index] = {
        id: updatedProject.id,
        name: updatedProject.name,
        thumbnail: updatedProject.thumbnail,
        createdAt: updatedProject.createdAt,
        updatedAt: updatedProject.updatedAt,
      };
      localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
    }
  } catch (error) {
    console.error('Error updating project:', error);
    throw new Error('Failed to update project');
  }
}

/**
 * Load a specific project
 */
export function loadProject(id: string): SavedProject | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const projectJson = localStorage.getItem(`${STORAGE_PREFIX}${id}`);
    if (!projectJson) return null;

    return JSON.parse(projectJson);
  } catch (error) {
    console.error('Error loading project:', error);
    return null;
  }
}

/**
 * Delete a project
 */
export function deleteProject(id: string): void {
  if (!isLocalStorageAvailable()) return;

  try {
    // Remove full project data
    localStorage.removeItem(`${STORAGE_PREFIX}${id}`);

    // Remove from projects list
    const projects = getAllProjects();
    const filtered = projects.filter(p => p.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error deleting project:', error);
    throw new Error('Failed to delete project');
  }
}

/**
 * Auto-save current work (overwrites previous auto-save)
 */
export function autoSave(data: Partial<SavedProject>): void {
  if (!isLocalStorageAvailable()) return;

  try {
    const autoSaveData = {
      ...data,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(AUTO_SAVE_KEY, JSON.stringify(autoSaveData));
  } catch (error) {
    console.error('Error auto-saving:', error);
    // Don't throw - auto-save should fail silently
  }
}

/**
 * Load auto-saved data
 */
export function loadAutoSave(): Partial<SavedProject> | null {
  if (!isLocalStorageAvailable()) return null;

  try {
    const autoSaveJson = localStorage.getItem(AUTO_SAVE_KEY);
    if (!autoSaveJson) return null;

    return JSON.parse(autoSaveJson);
  } catch (error) {
    console.error('Error loading auto-save:', error);
    return null;
  }
}

/**
 * Clear auto-save data
 */
export function clearAutoSave(): void {
  if (!isLocalStorageAvailable()) return;

  try {
    localStorage.removeItem(AUTO_SAVE_KEY);
  } catch (error) {
    console.error('Error clearing auto-save:', error);
  }
}

/**
 * Get storage usage information
 */
export function getStorageInfo(): {
  used: number;
  available: boolean;
  projectCount: number;
} {
  if (!isLocalStorageAvailable()) {
    return { used: 0, available: false, projectCount: 0 };
  }

  try {
    let totalSize = 0;
    for (let key in localStorage) {
      if (localStorage.hasOwnProperty(key) && key.startsWith(STORAGE_PREFIX)) {
        totalSize += localStorage[key].length + key.length;
      }
    }

    const projects = getAllProjects();

    return {
      used: totalSize,
      available: true,
      projectCount: projects.length,
    };
  } catch (error) {
    console.error('Error getting storage info:', error);
    return { used: 0, available: false, projectCount: 0 };
  }
}

/**
 * Export project as JSON file
 */
export function exportProjectAsJSON(project: SavedProject): void {
  const dataStr = JSON.stringify(project, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${project.name.replace(/[^a-z0-9]/gi, '-')}-${project.id}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Import project from JSON file
 */
export function importProjectFromJSON(jsonData: string): string {
  try {
    const project = JSON.parse(jsonData);

    // Validate basic structure
    if (!project.name) {
      throw new Error('Invalid project file: missing name');
    }

    // Remove old ID and timestamps - will be regenerated
    const { id, createdAt, updatedAt, ...projectData } = project;

    return saveProject(projectData);
  } catch (error) {
    console.error('Error importing project:', error);
    throw new Error('Failed to import project. Invalid file format.');
  }
}

import api from './client';
import { 
  CollegeResponse, 
  FiltersResponse, 
  CollegeDetail, 
  SavedCollege,
  AuthResponse
} from '../types';

// Auth
export const login = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/login', data);
  return response.data;
};

export const register = async (data: any): Promise<AuthResponse> => {
  const response = await api.post('/auth/register', data);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};

// Colleges
export const getColleges = async (params: any): Promise<CollegeResponse> => {
  const response = await api.get('/colleges', { params });
  return response.data;
};

export const getFilters = async (): Promise<FiltersResponse> => {
  const response = await api.get('/colleges/filters');
  return response.data;
};

export const getCollegeDetail = async (id: string): Promise<CollegeDetail> => {
  const response = await api.get(`/colleges/${id}`);
  return response.data;
};

export const compareColleges = async (ids: number[]): Promise<{ colleges: CollegeDetail[] }> => {
  const response = await api.post('/colleges/compare', { ids });
  return response.data;
};

// Saved
export const getSavedColleges = async (): Promise<{ saved: SavedCollege[] }> => {
  const response = await api.get('/saved');
  return response.data;
};

export const checkSaved = async (collegeId: string): Promise<{ saved: boolean }> => {
  const response = await api.get(`/saved/check/${collegeId}`);
  return response.data;
};

export const saveCollege = async (collegeId: number) => {
  const response = await api.post('/saved', { collegeId });
  return response.data;
};

export const unsaveCollege = async (collegeId: number) => {
  const response = await api.delete(`/saved/${collegeId}`);
  return response.data;
};

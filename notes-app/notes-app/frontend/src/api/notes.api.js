import axiosClient from './axiosClient';

export const getNotesApi = (search = '') =>
  axiosClient.get('/notes', { params: search ? { search } : {} });

export const getNoteApi = (id) => axiosClient.get(`/notes/${id}`);

export const createNoteApi = (payload) => axiosClient.post('/notes', payload);

export const updateNoteApi = (id, payload) => axiosClient.put(`/notes/${id}`, payload);

export const deleteNoteApi = (id) => axiosClient.delete(`/notes/${id}`);

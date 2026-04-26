import axios from 'axios';
export const deleteBook = (id) => api.delete(`/books/${id}`);
const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_BASE_URL,
});

export const fetchBooks = () => api.get('/books');
export const resetToGoldenState = () => api.post('/admin/reset');
export const addBook = (bookData) => api.post('/books', bookData);
export const updateBook = (id, bookData) => api.put(`/books/${id}`, bookData);
export default api;
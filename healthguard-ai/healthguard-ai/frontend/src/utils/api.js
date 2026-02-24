import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
});

export const targets = {
  list: () => API.get('/api/targets/'),
  create: (data) => API.post('/api/targets/', data),
  get: (id) => API.get(`/api/targets/${id}`),
  test: (id) => API.post(`/api/targets/${id}/test`),
  delete: (id) => API.delete(`/api/targets/${id}`),
};

export const scans = {
  list: () => API.get('/api/scans/'),
  create: (data) => API.post('/api/scans/', data),
  get: (id) => API.get(`/api/scans/${id}`),
  findings: (id, vulnOnly = false) => API.get(`/api/scans/${id}/findings?vulnerability_only=${vulnOnly}`),
  summary: (id) => API.get(`/api/scans/${id}/summary`),
};

export const probes = {
  list: (category) => API.get('/api/probes/', { params: category ? { category } : {} }),
  categories: () => API.get('/api/probes/categories'),
};

export const reports = {
  htmlUrl: (scanId) => `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/reports/${scanId}/html`,
  jsonUrl: (scanId) => `${process.env.REACT_APP_API_URL || 'http://localhost:8000'}/api/reports/${scanId}/json`,
};

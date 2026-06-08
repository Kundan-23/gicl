import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:3000/api' });

API.interceptors.request.use(cfg => {
  const token = localStorage.getItem('gicl_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('gicl_token');
      localStorage.removeItem('gicl_user');
      window.location.href = '/admin-login';
    }
    return Promise.reject(error);
  }
);

export const adminAPI = {
  // Dashboard
  getStats:             ()            => API.get('/admin/stats'),

  // Players
  getPlayers:           (params)      => API.get('/admin/players', { params }),
  getPlayerDetail:      (id)          => API.get(`/admin/players/${id}`),
  updatePlayerStatus:   (id, status)  => API.put(`/admin/players/${id}/toggle-status`, { status }),
  approveDocs:          (id)          => API.put(`/admin/players/${id}/approve-docs`),
  assignCoach:          (id, coachId) => API.put(`/admin/players/${id}/assign-coach`, { coachId }),
  deletePlayer:         (id)          => API.delete(`/admin/players/${id}`),

  // Payments
  getPayments:          ()            => API.get('/admin/payments'),

  // Referrals
  getReferrals:         ()            => API.get('/admin/referrals'),

  // Cashouts
  getCashouts:          (status)      => API.get('/admin/cashouts', { params: { status } }),
  approveCashout:       (id, note)    => API.put(`/admin/cashouts/${id}/approve`, { adminNote: note }),
  rejectCashout:        (id, note)    => API.put(`/admin/cashouts/${id}/reject`, { adminNote: note }),

  // Coaches
  getCoaches:           ()            => API.get('/admin/coaches'),
  createCoach:          (data)        => API.post('/admin/coaches', data),
  updateCoach:          (id, data)    => API.put(`/admin/coaches/${id}`, data),
  deleteCoach:          (id)          => API.delete(`/admin/coaches/${id}`),

  // Matches
  getMatches:           ()            => API.get('/admin/matches'),
  createMatch:          (data)        => API.post('/admin/matches', data),
  updateMatch:          (id, data)    => API.put(`/admin/matches/${id}`, data),
  deleteMatch:          (id)          => API.delete(`/admin/matches/${id}`),

  // Config
  getConfig:            ()            => API.get('/admin/config'),
  updateConfig:         (data)        => API.put('/admin/config', data),

  // Coach Video Uploads
  getCoachUploads:      (status)      => API.get('/admin/coach-uploads', { params: { status } }),
  approveCoachUpload:   (id)          => API.put(`/admin/coach-uploads/${id}/approve`),
  rejectCoachUpload:    (id, note)    => API.put(`/admin/coach-uploads/${id}/reject`, { adminNote: note }),
};

export default API;

import api from './axios';

export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, password) => api.put(`/auth/reset-password/${token}`, { password }),
  changePassword: (data) => api.put('/auth/change-password', data),
};

export const teacherAPI = {
  getProfile: () => api.get('/teacher/profile'),

  updateProfile: (data) => 
    api.put('/teacher/profile', data),

  uploadPhoto: (formData) => 
    api.post('/teacher/upload-photo', formData),

  uploadResume: (formData) => 
    api.post('/teacher/upload-resume', formData),

  getStatus: () => 
    api.get('/teacher/status'),
};



export const schoolAPI = {
  getProfile: () => api.get('/school/profile'),
  updateProfile: (data) => api.put('/school/profile', data),
  uploadLogo: (formData) => api.post('/school/upload-logo', formData),
  getRequirements: () => api.get('/school/requirements'),
  addRequirement: (data) => api.post('/school/requirements', data),
  updateRequirement: (id, data) => api.put(`/school/requirements/${id}`, data),
  deleteRequirement: (id) => api.delete(`/school/requirements/${id}`),
};

export const adminAPI = {
  getDashboard: () => api.get('/admin/dashboard'),
  getTeachers: (params) => api.get('/admin/teachers', { params }),
  getTeacher: (id) => api.get(`/admin/teachers/${id}`),
  updateTeacherStatus: (id, data) => api.put(`/admin/teachers/${id}/status`, data),
  assignTeacher: (id, data) => api.put(`/admin/teachers/${id}/assign`, data),
  getSchools: (params) => api.get('/admin/schools', { params }),
  getSchool: (id) => api.get(`/admin/schools/${id}`),
  verifySchool: (id, data) => api.put(`/admin/schools/${id}/verify`, data),
  toggleUserActive: (id) => api.put(`/admin/users/${id}/toggle-active`),
  createAdmin: (data) => api.post('/admin/create-admin', data),
  getAdmins: () => api.get('/admin/admins'),
  getContent: () => api.get('/admin/content'),
  addSliderImage: (formData) => api.post('/admin/content/slider', formData),
  deleteSliderImage: (id) => api.delete(`/admin/content/slider/${id}`),
  addBanner: (formData) => api.post('/admin/content/banner', formData),
  deleteBanner: (id) => api.delete(`/admin/content/banner/${id}`),
  updateStats: (data) => api.put('/admin/content/stats', data),
  updateContactInfo: (data) => api.put('/admin/content/contact', data),
  addVacancy: (data) => api.post('/admin/content/vacancies', data),
  updateVacancy: (id, data) => api.put(`/admin/content/vacancies/${id}`, data),
  deleteVacancy: (id) => api.delete(`/admin/content/vacancies/${id}`),
};

export const publicAPI = {
  getContent: () => api.get('/public/content'),
  getVacancies: () => api.get('/public/vacancies'),
};

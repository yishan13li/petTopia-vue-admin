import { defineStore } from 'pinia'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminInfo: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),

  getters: {
    getAdminName: (state) => state.adminInfo?.email?.split('@')[0] || '',
    getAdminRole: (state) => state.adminInfo?.role || '',
    getRegistrationDate: (state) => state.adminInfo?.registration_date || '',
    isAdmin: (state) => state.isAuthenticated
  },

  actions: {
    async fetchAdminInfo() {
      this.loading = true
      this.error = null
      try {
        const token = localStorage.getItem('adminToken')
        if (!token) {
          throw new Error('未找到管理員令牌')
        }

        const response = await axios.get(`${API_URL}/api/admin/current-admin`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (response.data) {
          const role = response.data.authorities[0].authority.replace('ROLE_', '')
          
          this.adminInfo = {
            email: response.data.email,
            role: role,
            isAuthenticated: response.data.isAuthenticated,
            adminId: response.data.adminId
          }
          this.isAuthenticated = true
          this.error = null
        }
      } catch (error) {
        console.error('獲取管理員資訊失敗:', error)
        this.error = error.message
        this.isAuthenticated = false
        this.adminInfo = null
        localStorage.removeItem('adminToken')
      } finally {
        this.loading = false
      }
    },

    setAdminInfo(info) {
      if (info) {
        console.log('設置管理員資訊:', info)
        this.adminInfo = {
          email: info.email,
          role: info.role,
          isAuthenticated: info.isAuthenticated || true,
          adminId: info.adminId
        }
        this.isAuthenticated = true
        this.error = null
      } else {
        console.log('清除管理員資訊')
        this.adminInfo = null
        this.isAuthenticated = false
      }
    },

    clearAdminInfo() {
      this.adminInfo = null
      this.isAuthenticated = false
      localStorage.removeItem('adminToken')
    }
  }
}) 
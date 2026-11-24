import axios from 'axios'

const api = axios.create({
  baseURL: '/api',
  withCredentials: true,          // send HTTP-only cookie with every request
  headers: { 'Content-Type': 'application/json' },
})

// Global response interceptor – redirect to login on 401
// IMPORTANT: only redirect when NOT already on a public page,
// otherwise the /auth/me session-check causes an infinite reload loop.
const PUBLIC_PATHS = ['/login', '/register']

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const isPublicPage = PUBLIC_PATHS.some((p) =>
      window.location.pathname.startsWith(p)
    )
    if (err.response?.status === 401 && !isPublicPage) {
      window.location.href = '/login'
    }
    return Promise.reject(err)
  }
)

export default api

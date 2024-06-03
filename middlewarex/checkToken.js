import axios from 'axios';
import { useRouter } from 'next/router';

const isAuthorized = async () => {
  try {
    const response = await axios.get('/api/auth/check-token');
    return response.data.isAuthorized;
  } catch (error) {
    return false;
  }
};

const protectedRoutes = ['/dashboard', '/profile'];

const CheckAuthorization = async () => {
  const router = useRouter();
  const { pathname } = router;
  const isProtectedRoute = protectedRoutes.includes(pathname);

  if (isProtectedRoute) {
    const isTokenAuthorized = await isAuthorized();
    if (!isTokenAuthorized) {
      router.push('/login');
    }
  }
};

export default CheckAuthorization;

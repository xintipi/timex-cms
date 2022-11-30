import { useAuthStore } from '@/store/auth';
import { every, isEmpty } from 'lodash-es';
import Auth from '@/models/Auth';

export const AuthGuard = async (_to, _from, next) => {
  next();
};

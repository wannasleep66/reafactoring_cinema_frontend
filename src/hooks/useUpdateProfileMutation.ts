import { useMutation } from './query';
import { updateCurrentUser } from '../api/user';

export function useUpdateProfileMutation() {
  return useMutation({
    mutationFn: updateCurrentUser,
  });
}
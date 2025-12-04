import { useMutation } from './query';
import { 
  createSession, 
  updateSession, 
  deleteSession, 
  type SessionCreate, 
  type SessionUpdate, 
  type Session 
} from '../api/session';

export function useCreateSessionMutation() {
  return useMutation<Session, SessionCreate>({
    mutationFn: createSession,
  });
}

export function useUpdateSessionMutation() {
  return useMutation<Session, { id: string; data: SessionUpdate }>({
    mutationFn: ({ id, data }) => updateSession(id, data),
  });
}

export function useDeleteSessionMutation() {
  return useMutation<void, { id: string }>({
    mutationFn: ({ id }) => deleteSession(id),
  });
}
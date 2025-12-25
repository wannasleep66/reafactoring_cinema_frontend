import { useCrudMutations } from './useCrudMutations';
import {
  createSession,
  updateSession,
  deleteSession,
  type SessionCreate,
  type SessionUpdate,
  type Session
} from '../api/session';

export function useSessionMutations() {
  return useCrudMutations<Session, SessionCreate, SessionUpdate>({
    create: createSession,
    update: updateSession,
    delete: deleteSession,
  });
}
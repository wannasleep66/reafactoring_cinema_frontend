import { useMutation } from './query';

interface ApiFunctions<T, TCreate, TUpdate> {
  create: (data: TCreate) => Promise<T>;
  update: (id: string, data: TUpdate) => Promise<T>;
  delete: (id: string) => Promise<void>;
}

interface CrudMutations<T, TCreate, TUpdate> {
  createMutation: ReturnType<typeof useMutation<T, TCreate>>;
  updateMutation: ReturnType<typeof useMutation<T, { id: string; data: TUpdate }>>;
  deleteMutation: ReturnType<typeof useMutation<void, { id: string }>>;
}

export function useCrudMutations<T, TCreate, TUpdate>(
  apiFunctions: ApiFunctions<T, TCreate, TUpdate>
): CrudMutations<T, TCreate, TUpdate> {
  return {
    createMutation: useMutation<T, TCreate>({
      mutationFn: apiFunctions.create,
    }),
    updateMutation: useMutation<T, { id: string; data: TUpdate }>({
      mutationFn: ({ id, data }) => apiFunctions.update(id, data),
    }),
    deleteMutation: useMutation<void, { id: string }>({
      mutationFn: ({ id }) => apiFunctions.delete(id),
    }),
  };
}
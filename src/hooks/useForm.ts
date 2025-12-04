import { useState, useCallback } from "react";

// Generic form state type - T can be any object structure
type UseFormReturn<T> = {
  form: {
    data: T;
    loading: boolean;
  };
  registerField: <K extends keyof T>(
    name: K,
    options?: {
      transformer?: (value: string) => T[K];
    }
  ) => {
    value: T[K];
    onChange: (e: React.ChangeEvent<any>) => void;
  };
  resetForm: (initialData?: T) => void;
  handleSubmit: (mutationFn: (data: T) => Promise<any>) => Promise<void>;
};

export function useForm<T>(initialData: T): UseFormReturn<T> {
  const [form, setForm] = useState<{
    data: T;
    loading: boolean;
  }>({
    data: initialData,
    loading: false,
  });

  const registerField = useCallback(
    <K extends keyof T>(
      name: K,
      options?: {
        transformer?: (value: string) => T[K];
      }
    ) => {
      return {
        value: form.data[name],
        onChange: (e: React.ChangeEvent<any>) => {
          const value = options?.transformer
            ? options.transformer(e.target.value)
            : (e.target.value as T[K]);

          setForm((prev) => ({
            ...prev,
            data: {
              ...prev.data,
              [name]: value,
            },
          }));
        },
      };
    },
    [form.data]
  );

  const resetForm = useCallback((initialData?: T) => {
    setForm((prev) => ({
      data: initialData || prev.data,
      loading: false,
    }));
  }, []);

  const handleSubmit = useCallback(
    async (mutationFn: (data: T) => Promise<any>) => {
      setForm((prev) => ({ ...prev, loading: true }));
      try {
        await mutationFn(form.data);
      } finally {
        setForm((prev) => ({ ...prev, loading: false }));
      }
    },
    [form.data]
  );

  return {
    form,
    registerField,
    resetForm,
    handleSubmit,
  };
}

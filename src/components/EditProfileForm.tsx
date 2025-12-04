import { useEffect, useState } from "react";
import { useQuery } from "../hooks/query";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";
import Fallback from "./shared/Fallback";
import { getCurrentUser, type User } from "../api/user";

const EditProfileForm: React.FC = () => {
  const {
    data: profile,
    loading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryFn: getCurrentUser,
  });

  const { mutate: updateProfile, loading: isUpdating } = useUpdateProfileMutation();

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [form, setForm] = useState<{ data?: Partial<User>; loading: boolean }>({
    data: profile,
    loading: false,
  });

  useEffect(() => {
    setForm({ data: profile, loading: false });
  }, [profile]);

  const handleEdit = async () => {
    setForm((prevForm) => ({ ...prevForm, loading: true }));
    try {
      await updateProfile(form.data!);
      setIsEditing(false);
      refetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setForm((prevForm) => ({ ...prevForm, loading: false }));
    }
  };

  const registerField = (name: keyof User) => {
    return {
      value: form.data ? form.data[name] : "",
      onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm((prevForm) => ({
          ...prevForm,
          data: {
            ...prevForm.data,
            [name]: e.target.value,
          },
        }));
      },
    };
  };

  return (
    <div className="card text-dark mb-4">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">Профиль</h2>
        <Fallback loading={isProfileLoading}>
          <div className="d-flex flex-column gap-2">
            <input className="text-light" {...registerField("firstName")} />
            <input className="text-light" {...registerField("lastName")} />
            <input className="text-light" {...registerField("email")} />
            <input className="text-light" {...registerField("gender")} />
            <input className="text-light" {...registerField("age")} />
          </div>
          <div className="mt-4">
            {!isEditing ? (
              <>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Редактировать
                </button>
              </>
            ) : (
              <>
                <button
                  className="btn btn-success me-2"
                  onClick={handleEdit}
                  disabled={form.loading}
                >
                  {form.loading ? 'Сохранение...' : 'Сохранить'}
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={form.loading}
                >
                  Отмена
                </button>
              </>
            )}
          </div>
        </Fallback>
      </div>
    </div>
  );
};

export default EditProfileForm;

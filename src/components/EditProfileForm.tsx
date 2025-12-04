import { useEffect, useState } from "react";
import { useQuery } from "../hooks/query";
import Fallback from "./shared/Fallback";
import { getCurrentUser, updateCurrentUser, type User } from "../api/user";

const EditProfileForm: React.FC = () => {
  const {
    data: profile,
    loading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryFn: getCurrentUser,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [form, setForm] = useState<{ data?: Partial<User>; loading: boolean }>({
    data: profile,
    loading: false,
  });

  useEffect(() => {
    setForm({ data: profile, loading: false });
  }, [profile]);

  const handleEdit = async () => {
    setIsEditing(false);
    await updateCurrentUser(form.data!);
    setForm((prevForm) => ({ ...prevForm, loading: false }));
    setIsEditing(false);
    refetchProfile();
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
                <button className="btn btn-success me-2" onClick={handleEdit}>
                  Сохранить
                </button>
                <button
                  className="btn btn-secondary"
                  onClick={() => setIsEditing(false)}
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

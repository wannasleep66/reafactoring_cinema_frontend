import { useEffect, useState } from "react";
import { useQuery } from "../hooks/query";
import { useUpdateProfileMutation } from "../hooks/useUpdateProfileMutation";
import { useForm } from "../hooks/useForm";
import { getCurrentUser, type User } from "../api/user";

const EditProfileForm: React.FC = () => {
  const {
    data: profile,
    loading: isProfileLoading,
    refetch: refetchProfile,
  } = useQuery({
    queryFn: getCurrentUser,
  });

  const { mutate: updateProfile, loading: isUpdating } =
    useUpdateProfileMutation();

  const { form, registerField, resetForm, handleSubmit } = useForm<
    Partial<User>
  >({
    firstName: "",
    lastName: "",
    email: "",
    gender: "" as User["gender"],
    age: 0,
  });

  const [isEditing, setIsEditing] = useState<boolean>(false);

  useEffect(() => {
    if (profile) {
      resetForm(profile);
    }
  }, [profile, resetForm]);

  const handleEdit = async () => {
    await handleSubmit(async (data) => {
      await updateProfile(data);
      setIsEditing(false);
      refetchProfile();
    });
  };

  return (
    <div className="card text-dark mb-4">
      <div className="card-body">
        <h2 className="card-title text-primary mb-3">Профиль</h2>
        {isProfileLoading ? (
          <div>Загружаем</div>
        ) : (
          <>
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
                    {form.loading ? "Сохранение..." : "Сохранить"}
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
          </>
        )}
      </div>
    </div>
  );
};

export default EditProfileForm;

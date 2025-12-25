import EditProfileForm from "../components/EditProfileForm";
import UserPurchases from "../components/UserPurchases";
import { useState } from "react";

export default function UserProfilePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-vh-100 bg-dark text-light p-4">
      <EditProfileForm />
      <UserPurchases key={refreshTrigger} onRefresh={handleRefresh} />
    </div>
  );
}
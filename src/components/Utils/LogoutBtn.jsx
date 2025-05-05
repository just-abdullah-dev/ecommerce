"use client";

import { useUser } from "@/contexts/user";
import { fetchCustom } from "@/lib/utils";
import { useRouter } from "next/navigation";

export default function LogoutBtn({ children }) {

  const { deleteUser } = useUser();

  const handleLogout = async () => {
    // First, sign out from the frontend
   
    deleteUser();

    // Then, call the backend logout endpoint

    // Finally, redirect to the login page
    window.location.reload();
  };

  return <div onClick={handleLogout}>{children}</div>;
}

"use client";

import Searchbar from "@/app/components/global/Searchbar";
import Sidebar from "@/app/components/global/Sidebar";
import { getAuth } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const Settings = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const auth = getAuth();

  const router = useRouter();

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUserName(currentUser.displayName);
      setEmail(currentUser.email);
    }
  }, [auth]);

  const handleUpgrade = () => {
    router.push("/choose-plan")
  }

  return (
    <>
      <Sidebar />
      <div className="h-[100rem] text-black">
        <Searchbar />
        <div>Email: {email}</div>
        <div>Username: {userName}</div>
        <button onClick={() => handleUpgrade()}>Upgrade Plan</button>
      </div>
    </>
  );
};

export default Settings;

"use client";

import { getPremiumStatus } from "@/app/components/choose-plan/getPremiumStatus";
import { getPortalUrl } from "@/app/components/choose-plan/stripePayments";
import Searchbar from "@/app/components/global/Searchbar";
import Sidebar from "@/app/components/global/Sidebar";
import { openModal } from "@/app/redux/features/modalSlice";
import { RootState } from "@/app/redux/store";
import { getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const Settings = () => {
  const dispatch = useDispatch();
  const auth = getAuth();
  const app = getApp();
  const [email, setEmail] = useState<string | null>(null);
  const user = auth.currentUser;

  const router = useRouter();

  const handleUpgrade = () => {
    router.push("/choose-plan");
  };

  // const manageSubscription = async () => {
  //   const portalUrl = await getPortalUrl(app);
  //   router.push(portalUrl);
  // };

  const handleLogin = () => {
    dispatch(openModal("login"));
  };

  const isPremium = useSelector((state: RootState) => state.premium.isPremium);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setEmail(currentUser.email);
    }
  }, [auth]);

  return (
    <>
      <Sidebar />
      <Searchbar />
      <div className="py-10">
        <div className="mx-auto px-6 max-w-[1070px]">
          <div className=" text-left border-b border-b-gray-200 text-[32px] font-bold pb-4 mb-8">
            Settings
          </div>
          {!user ? (
            <div className="max-w-[460px] flex flex-col items-center mx-auto">
              <Image
                src={"/login.png"}
                alt="login image"
                height={800}
                width={800}
                className="h-full w-auto"
              />
              <div className="text-2xl font-bold text-center mb-4">
                Login to your account to see your details.
              </div>
              <button className="btn max-w-[100px]" onClick={handleLogin}>
                Login
              </button>
            </div>
          ) : (
            <div>
              {isPremium ? (
                <>
                  <div className="flex flex-col items-start gap-2 mb-8 border-b border-b-gray-200 pb-6">
                    <h1 className="text-lg font-bold">
                      Your Subscription Plan:
                    </h1>
                    <div className="text-base">Premium</div>
                    <button
                      className="btn max-w-[100px] cursor-not-allowed"
                      onClick={() => {}}
                    >
                      Manage Subscription
                    </button>
                  </div>
                  <div className="flex flex-col items-start gap-2 pb-6">
                    <h1 className="font-bold">Email:</h1>
                    <div>{email}</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex flex-col items-start gap-2 mb-8 border-b border-b-gray-200 pb-6">
                    <h1 className="text-lg font-bold">
                      Your Subscription Plan:
                    </h1>
                    <div className="text-base">None</div>
                    <button
                      className="btn max-w-[100px]"
                      onClick={() => handleUpgrade()}
                    >
                      Upgrade to Premium
                    </button>
                  </div>
                  <div className="flex flex-col items-start gap-2 pb-6">
                    <h1 className="font-bold">Email:</h1>
                    {email ? <div>{email}</div> : <div>acecorrea@example.com</div>}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Settings;

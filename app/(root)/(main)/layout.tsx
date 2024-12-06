import Searchbar from "@/app/components/global/Searchbar";
import LoginModal from "@/app/components/LoginModal";
import React from "react";

export default function mainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <LoginModal />
      <Searchbar />
      <div className="ml-[200px]">{children}</div>
    </>
  );
}

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
      <div className="ml-[200px]">{children}</div>
    </>
  );
}

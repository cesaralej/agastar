"use client";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [loading, setLoading] = useState(true);
  const currentUser = useUser();
  const router = useRouter();

  useEffect(() => {
    if (currentUser === null) {
      router.push("/auth");
    } else if (currentUser) {
      setLoading(false);
    }
  }, [currentUser, router]);

  //Hidration no me deja usar el spinner
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        loading...
      </div>
    );
  }

  return <div className="max-w-4xl  mx-auto">{children}</div>;
}

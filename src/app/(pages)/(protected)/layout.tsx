"use client";
import { useUser } from "@/lib/auth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

//Hace que la pagina haga un loading innecesario pero no encuentro mejor manera de poner protected routes.
//Ademas no me gusta que todo queda abajo de /main

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [loading, setLoading] = useState(true);
  const currentUser = useUser();
  const router = useRouter();

  console.log("ML Render");

  useEffect(() => {
    if (currentUser === null) {
      router.push("/auth");
    } else if (currentUser) {
      setLoading(false); // Auth check complete
    }
  }, [currentUser, router]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        loading...
      </div>
    );
  }

  return <div className="max-w-4xl  mx-auto">{children}</div>;
}

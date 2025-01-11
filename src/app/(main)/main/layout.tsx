"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { useAuthState } from "react-firebase-hooks/auth";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

//Hace que la pagina haga un loading innecesario pero no encuentro mejor manera de poner protected routes.
//Ademas no me gusta que todo queda abajo de /main
//El user siempre llega null

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const router = useRouter();
  const [user, loadingUser] = useAuthState(auth);
  const [isUserValid, setIsUserValid] = useState<boolean>(false);

  //console.log("ML Render");

  useEffect(() => {
    const checkAuth = () => {
      console.log("ML useEffect Checking auth");
      if (user) {
        setIsUserValid(true);
        //console.log("This is the logged in user", user);
      } else {
        console.log("ML no user found");
        router.push("/");
      }
    };

    checkAuth();
  }, [user, router]);

  if (loadingUser) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!isUserValid) {
    return null;
  }

  return <div className="max-w-4xl  mx-auto">{children}</div>;
}

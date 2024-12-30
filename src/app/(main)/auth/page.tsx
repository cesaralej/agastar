"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/firebase";
import {
  useCreateUserWithEmailAndPassword,
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";

import { FcGoogle } from "react-icons/fc"; // Import Google icon
import { AiOutlineMail, AiOutlineLock } from "react-icons/ai";

const AuthPage = () => {
  const router = useRouter();

  const [createUserWithEmailAndPassword, createUserLoading, createUserError] =
    useCreateUserWithEmailAndPassword(auth);
  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);
  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); // New state for confirm password
  const [passwordError, setPasswordError] = useState<string | null>(null);

  useEffect(() => {
    if (user || googleUser) {
      router.push("/main/dashboard"); // Redirect to home if user is already logged in
    }
  }, [user, googleUser, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(email, password);
      if (error) {
        console.log(
          "createUserWithEmailAndPassword error:",
          error.code,
          error.message
        );
        // Handle specific errors here (e.g., check error.code)
      } else {
        // User created successfully
        router.push("/dashboard");
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log("An unknown error occurred");
      }
    }
    setPassword(""); // Clear password after successful login
  };

  interface AuthError {
    message: string;
  }

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    } else {
      setPasswordError(null);
    }
    createUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        if (userCredential) {
          router.push("/dashboard");
        }
      })
      .catch((error: AuthError) => {
        console.log(error.message);
      });

    setPassword(""); // Clear password after successful signup
    setConfirmPassword(""); // Clear confirm password after successful signup
  };

  const onGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
      router.push("/dashboard"); // Redirect to home programmatically after success
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          {isSignup ? "Create Account" : "Login"}
        </h2>
        {(error || googleError || createUserError || passwordError) && (
          <p className="text-red-500 mb-4">
            {error?.message ||
              googleError?.message ||
              createUserError?.message ||
              passwordError}
          </p>
        )}
        <form onSubmit={isSignup ? handleSignup : handleLogin}>
          <div className="mb-4 relative">
            <AiOutlineMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-10 py-2 border rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
          <div className="mb-6 relative">
            <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-10 py-2 border rounded-md focus:ring focus:ring-blue-300"
              required
            />
          </div>
          {isSignup && ( // Conditionally render confirm password field
            <div className="mb-6 relative">
              <AiOutlineLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-10 py-2 border rounded-md focus:ring focus:ring-blue-300"
                required
              />
            </div>
          )}
          <button
            type="submit"
            disabled={loading || createUserLoading} // Disable button during loading
            className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 rounded-md focus:outline-none focus:ring focus:ring-blue-300 disabled:bg-gray-400"
          >
            {isSignup ? "Sign Up" : "Sign In"}
          </button>
        </form>
        <div className="mt-6 text-center">
          <button
            onClick={onGoogleSignIn}
            disabled={googleLoading}
            className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-2 rounded-md flex items-center justify-center disabled:bg-gray-400"
          >
            {googleLoading ? (
              "Signing in..."
            ) : (
              <>
                <FcGoogle className="mr-2 text-xl" /> Sign in with Google
              </>
            )}
          </button>
        </div>
        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => setIsSignup(!isSignup)}
            className="text-sm text-gray-600 hover:text-gray-800"
          >
            {isSignup ? "Already have an account? Log in" : "Create an account"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;

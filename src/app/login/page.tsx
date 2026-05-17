"use client";

import { useState } from "react";

import {
  signInWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        );

      const user = userCredential.user;

      // ADMIN EMAIL
      if (user.email === "yarwngmathematics@gmail.com") {

        router.push("/admin");

      } else {

        router.push("/student");
      }

    } catch (error) {

      alert(
        "Account not found.\nPlease create a new account first."
      );
    }
  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-md">

        <h1 className="text-4xl font-bold text-center mb-8">
          Login
        </h1>

        {/* Email */}
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border p-4 rounded-xl mb-4"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border p-4 rounded-xl mb-6"
        />

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="
            w-full
            bg-blue-600
            hover:bg-blue-700
            text-white
            py-4
            rounded-xl
            text-xl
            font-bold
            transition
          "
        >
          Login
        </button>

        {/* Create Account */}
        <a
          href="/register"
          className="
            block
            text-center
            mt-5
            text-blue-600
            font-semibold
            hover:underline
          "
        >
          Create New Account
        </a>

      </div>

    </main>
  );
}
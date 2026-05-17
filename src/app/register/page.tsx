"use client";

import { useState } from "react";

import {
  createUserWithEmailAndPassword,
} from "firebase/auth";

import { auth } from "../firebase";

import { useRouter } from "next/navigation";

export default function RegisterPage() {

  const router = useRouter();

  const [name, setName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [phone, setPhone] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {

    try {

      await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      alert("Registration Successful!");

      router.push("/login");

    } catch (error: any) {

      alert(error.message);
    }
  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4">

      <div className="bg-white p-10 rounded-3xl shadow-2xl w-full max-w-lg">

        <h1 className="text-4xl font-bold text-center mb-8">
          Create New Account
        </h1>

        <div className="space-y-4">

          {/* Student Name */}
          <input
            type="text"
            placeholder="Student Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          {/* Phone */}
          <input
            type="text"
            placeholder="Whatsapp Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          {/* Class */}
          <select
            value={studentClass}
            onChange={(e) => setStudentClass(e.target.value)}
            className="w-full border p-4 rounded-xl"
          >
            <option value="">Select Class</option>
            <option>Class 10</option>
            <option>Class 11</option>
            <option>Class 12</option>
          </select>

          {/* Email */}
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Create Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border p-4 rounded-xl"
          />

          {/* Register Button */}
          <button
            onClick={handleRegister}
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
            Register
          </button>

          {/* Login Link */}
          <a
            href="/login"
            className="
              block
              text-center
              mt-4
              text-blue-600
              font-semibold
              hover:underline
            "
          >
            Already have an account? Login
          </a>

        </div>

      </div>

    </main>
  );
}
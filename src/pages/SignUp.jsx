import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function SignUp() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");


 const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const response = await fetch(`http://localhost:5000/api/users/signUp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email }),
      credentials: "include",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to register");
    }

    toast.success("Sign up successful!");
    navigate("/signin");
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error(error.message || "An error occurred during registration");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br  px-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
        {/* Heading */}
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          Create Account 
        </h2>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Sign up to get started
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Your Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="w-full px-4 py-3 rounded-lg border bg-gray-50 border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 text-sm"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200"
            type="submit"
          >
            Sign Up
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-gray-600">
          If you Already Registered?{" "}
          <Link
            to="/signin"
            className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
          >
            Click here
          </Link>
        </p>
      </div>
    </div>
  );
}
"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import useUser from "@/contexts/user";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Delay between each child animation
    },
  },
};

const fadeInVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8 } },
};

const slideInVariants = {
  hidden: { opacity: 0, x: -20 },
  show: { opacity: 1, x: 0, transition: { duration: 0.8 } },
};

export default function SignInPage() {
  //design implemented for one input field extend as required
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { user, setUser } = useUser();

  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    }
  }, [isLoading]);

  const validateEmail = (value) => {
    // Basic email validation regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(value);
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Set error state based on validation
    setIsError(value === "" || !validateEmail(value));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
        const res = await fetch("/api/v1/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });
    const result = await res.json();
    if (result?.success) {
      setUser(result?.data);
      toast({
        variant: "custom",
        description: result?.message || "Logged in successfully.",
      });
    } else {
        toast({
            variant: "destructive",
            description: result?.message || "Sign in failed. Try Again",
          });
    }
    } catch (error) {
        toast({
            variant: "destructive",
            description: "An error occurred. Please try again.",
        });
        console.error("Error during sign-in:", error);
    }

    setIsLoading(false);
  };

  return (
    <motion.div
      className="min-h-screen flex flex-col items-center justify-center px-4 bg-white"
      initial="hidden"
      animate="show"
      variants={containerVariants}
    >
      <motion.div
        className="w-full max-w-md space-y-8"
        variants={fadeInVariants}
      >
        {/* Logo */}
        <motion.div className="flex justify-center" variants={slideInVariants}>
          <Link href={"/"}>
            <Image
              src="/images/logo/1_black.png"
              alt={process.env.NEXT_PUBLIC_STORE_NAME}
              width={200}
              height={60}
              priority
            />
          </Link>
        </motion.div>

        {/* Heading */}
        <motion.div variants={fadeInVariants}>
          <h3 className="text-2xl font-bold text-center pt-2">Welcome back</h3>
          <p className="opacity-90 font-light">
            One account connected to everything including online store.
          </p>
        </motion.div>

        <motion.form
          className="space-y-4"
          variants={containerVariants} // Apply container-level animation for stagger effect
        >
          <motion.div variants={fadeInVariants}>
            <input
              type="email"
              value={email}
              onChange={handleChange}
              placeholder="Email"
              className={`
        w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 
        border-gray-300 
        focus:outline-none focus:ring-1 focus:ring-navy-500 focus:border-transparent 
        peer
        ${
          isError
            ? "border-red-600 ring-1 shadow- shadow-red-200 ring-red-600"
            : " focus:ring-2 focus:ring-[#000] focus:border-transparent"
        }
      `}
              required
              data-error={isError.toString()}
            />
          </motion.div>

          <motion.div variants={fadeInVariants}>
            <input
              type="password"
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#000] focus:border-transparent"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
              }}
            />
          </motion.div>

          <motion.div variants={slideInVariants}>
            <button
              disabled={!email || !password || isLoading}
              onClick={handleSubmit}
              className="w-full py-3 min-h-14 rounded-lg text-white shadow-md shadow-gray-300 font-medium  hover:text-[#000] hover:from-white hover:to-white  duration-300 hover:border-2 hover:border-[#000] bg-gradient-to-r from-[#000] to-[#000] hover:opacity-90 transition-opacity disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? <Loader2 className=" animate-spin" /> : "Login"}
            </button>
          </motion.div>
        </motion.form>
      </motion.div>
    </motion.div>
  );
}

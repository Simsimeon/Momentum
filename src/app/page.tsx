"use client";

import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import SplashScreen from "@/components/SplashScreen";
import Dashboard from "@/components/Dashboard";
import useAuthStore from "@/store/useAuthStore";

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { session } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
    // Hide splash screen after 5.5 seconds (User's preferred time)
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (mounted && !showSplash && !session) {
      router.push("/auth/login");
    }
  }, [mounted, showSplash, session, router]);

  if (!mounted) return <SplashScreen />;

  return (
    <main>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" />
        ) : session ? (
          <Dashboard key="dashboard" />
        ) : (
          // Return null or a loader while redirecting
          null
        )}
      </AnimatePresence>
    </main>
  );
}




'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";

interface ProtectedProps {
  children: ReactNode;
}

export function Protected({ children }: ProtectedProps) {
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) {
      router.replace("/signin");
    } else {
      setLoading(false); 
    }
  }, [user, router]);

  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!user) {
    return null; 
  }

  return <>{children}</>;
}
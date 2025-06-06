"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Account, Client } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

const account = new Account(client);

interface UserProfile {
  name?: string;
  email?: string;
  labels?: string[];
}

export default function ProfileCard() {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    account.get()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null));
  }, []);

  if (!user) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="text-right">
          <p className="font-medium bg-gray-200 rounded w-24 h-5 mb-1"></p>
          <p className="text-sm text-gray-400 bg-gray-200 rounded w-32 h-4"></p>
        </div>
        <Avatar>
          <AvatarFallback></AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-medium">{user.name || user.email}</p>
        <p className="text-sm text-gray-600">{user.email}</p>
      </div>
      <Avatar>
        <AvatarFallback>
          {(user.name || user.email || "?")
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()}
        </AvatarFallback>
      </Avatar>
    </div>
  );
}
"use client";

import { useUser, UserButton } from "@clerk/nextjs";

export default function ProfileCard() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        <div className="text-right">
          <p className="font-medium bg-gray-200 rounded w-24 h-5 mb-1"></p>
          <p className="text-sm text-gray-400 bg-gray-200 rounded w-32 h-4"></p>
        </div>
        <div className="w-10 h-10 rounded-full bg-gray-200" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right">
        <p className="font-medium">
          {user.fullName || user.emailAddresses[0]?.emailAddress}
        </p>
        <p className="text-sm text-gray-600">
          {user.emailAddresses[0]?.emailAddress}
        </p>
      </div>
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
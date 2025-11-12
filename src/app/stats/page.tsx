"use client";

import { startTransition, useActionState } from "react";
import { createPost } from "../actions";

export default function StatsPage() {
  const [state, action, pending] = useActionState(createPost, false);

  return (
    <div className="space-y-6">
      <button onClick={() => startTransition(() => action(new FormData()))}>
        {pending ? "loading" : "Create Post"}
      </button>
      <h1 className="text-3xl font-bold">Statistics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Weekly Summary</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">Coding Hours: 12</p>
            <p className="text-gray-600 dark:text-gray-300">Articles Read: 5</p>
            <p className="text-gray-600 dark:text-gray-300">
              Focus Sessions: 8
            </p>
          </div>
        </div>
        <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Monthly Progress</h2>
          <div className="space-y-2">
            <p className="text-gray-600 dark:text-gray-300">
              Total Coding Time: 48hrs
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Completed Tasks: 15
            </p>
            <p className="text-gray-600 dark:text-gray-300">
              Learning Goals Met: 3/5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

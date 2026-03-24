"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function HeroLeadCapture() {
  const [text, setText] = useState("");
  const router = useRouter();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    // Store the description so the request form can pick it up
    try {
      localStorage.setItem(
        "gcg-lead-form",
        JSON.stringify({
          form: { serviceCategory: "not-sure", notSureText: text.trim() },
          step: 2,
        })
      );
    } catch {
      // fallback: pass as query param
    }
    router.push("/request");
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-lg gap-2">
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="What do you need help with? e.g. &quot;leaky roof&quot;, &quot;panel upgrade&quot;..."
        className="flex-1 rounded-xl border-2 border-gray-200 bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:border-amber-500 focus:outline-none transition-colors"
        aria-label="Describe your project"
      />
      <button
        type="submit"
        className="shrink-0 rounded-xl bg-gray-900 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-800"
      >
        Get Quotes
      </button>
    </form>
  );
}

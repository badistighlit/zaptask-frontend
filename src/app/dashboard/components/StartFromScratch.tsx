"use client";

import { useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
const StartFromScratch = () => {
  const router = useRouter();

  return (
    <div className="border p-4 rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-2">Start from Scratch</h2>
      <Button onClick={() => router.push("/workflows")}>Create New Workflow</Button>
    </div>
  );
};

export default StartFromScratch;

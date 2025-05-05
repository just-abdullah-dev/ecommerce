"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

const ShowError = ({ error }) => {
  const router = useRouter();

  const handleReload = () => {
    router.refresh();
  };

  return (
    <div className="flex flex-col items-center justify-center bg-white text-center p-6 rounded-lg shadow-md min-h-[250px] max-h-[300px]">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
      <p className="text-red-600 mb-6">{error}</p>
      <Button onClick={handleReload}>Reload</Button>
    </div>
  );
};

export default ShowError;

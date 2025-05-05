import { Input } from "../ui/input";

export default function InputComp({ isError, ...props }) {
  return (
    <Input
      // w-full px-4 py-3 rounded-lg border shadow-md shadow-gray-300
      // border-gray-300
      className={`
        bg-gray-200
        focus:outline-none focus:ring-1 focus:ring-[#26B9B3] focus:border-transparent 
        peer
        ${
          isError
            ? "border-red-600 ring-[.5px] shadow-red-200 ring-red-600"
            : " focus:ring-2 focus:ring-[#26B9B3] focus:border-transparent"
        }
      `}
      {...props}
    />
  );
}

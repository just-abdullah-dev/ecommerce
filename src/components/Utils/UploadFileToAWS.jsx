"use client";
import { useState } from "react";
import { Button } from "../ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader } from "lucide-react";

const UploadFileToAWS = ({ prevFileName = "", setFileName }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploaded, setUploaded] = useState(false);

  const handleFileChange = (e) => {
    setUploaded(false);
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/aws-s3-upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log(data);
      if (data?.success) {
        setFileName(data?.fileName);
        setUploaded(true);
        if (prevFileName) {
          await handleDelete(prevFileName);
        }
      } else {
        toast({
          variant: "destructive",
          description: "Error: " + data?.message,
        });
      }
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
    }
  };

  const handleDelete = async (fileName) => {
    try {
      const response = await fetch("/api/aws-s3-upload", {
        method: "DELETE",
        body: JSON.stringify({ fileName }),
      });

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className=" w-[70%]">
      <form>
        <input
          type="file"
          // accept="image/*"
          onChange={handleFileChange}
        />
        <Button
          onClick={handleSubmit}
          className=" w-1/2"
          disabled={!file || uploading || uploaded}
        >
          {uploading ? (
            <Loader className="animate-spin" />
          ) : uploaded ? (
            "Uploaded"
          ) : (
            "Upload"
          )}
        </Button>
      </form>
    </div>
  );
};

export default UploadFileToAWS;

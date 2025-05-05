import { Button } from "@/components/ui/button";
import html2pdf from "html2pdf.js";
import React from "react";

export default function DownloadReportBtn({ contentRef, name }) {
  const handleDownloadPDF = async () => {
    const options = {
      filename: name,
      image: { type: "jpeg", quality: 1.0 },
      html2canvas: { scale: 4 }, // Higher scale for better quality
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    const element = contentRef.current; // The HTML element to convert to PDF
    html2pdf().set(options).from(element).save();
  };

  return <Button onClick={handleDownloadPDF}>Download PDF</Button>;
}

import { useEffect, useState } from "react";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const DisplayPDF = ({ targetRef }) => {
  const [pdfUrl, setPdfUrl] = useState(null);

  useEffect(() => {
    if (targetRef) {
      const main = async () => {

        const element = targetRef.current;
        if (!element) return;
  
        const scale = 2; // lower = more compressed, but less quality
  
        const canvas = await html2canvas(element, {
          scale,
          useCORS: true,
        });
        const imgData = canvas.toDataURL("image/jpeg", 0.7); // use JPEG + compression
        const pdf = new jsPDF("p", "mm", "a4");
  
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
        pdf.addImage(imgData, "JPEG", 0, 0, pdfWidth, pdfHeight);
        const blob = pdf.output("blob");
        const file = new File([blob], `invoice.pdf`, {
          type: "application/pdf",
        });
  
        const url = URL.createObjectURL(file);
        setPdfUrl(url);
  
        // Cleanup when component unmounts
        return () => URL.revokeObjectURL(url);
      }
      main()
    }
  }, [targetRef]);

  return (
    <div className="w-full h-[80vh]">
      {pdfUrl ? (
        <iframe
          src={pdfUrl}
          title="Invoice"
          className="w-full h-full"
          frameBorder="0"
        />
      ) : (
        <p>Loading PDF...</p>
      )}
    </div>
  );
};

export default DisplayPDF;

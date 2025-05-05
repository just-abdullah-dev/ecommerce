"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as XLSX from "xlsx";
import ShowDataInTable from "./ShowDataInTable";
import { Upload } from "lucide-react";

export default function GetDataFromExcel({ setData }) {
  const [dataState, setDataState] = useState([]);

  const handleFileUpload = (event) => {
    const fileInput = event.target;
    const file = fileInput.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result);
      const workbook = XLSX.read(data, { type: "array" });

      // Assuming the first sheet is the one we want
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];

      // Convert the sheet to JSON
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: true });

      // Convert numeric date values to ISO date format
      // const convertedData = jsonData.map((row) => {
      //   const convertedRow = { ...row };
      //   for (const key in convertedRow) {
      //     // Check if the value is a number (potentially a date)

      //     if (typeof convertedRow[key] === "number") {
      //       const isDate = isValidExcelDate(convertedRow[key]);
      //       if (isDate) {
      //         // Convert Excel serial date to ISO format
      //         convertedRow[key] = convertExcelDateToISO(convertedRow[key]);
      //       }
      //     }
      //   }
      //   return convertedRow;
      // });
      const convertedData = jsonData.map((row) => {
        const convertedRow = { ...row };
        for (const key in convertedRow) {
          // Check if the column name ends with "date"
          if (key.toLowerCase().endsWith("date")) {
            // Check if the value is a number (potentially a date)
            if (typeof convertedRow[key] === "number") {
              const isDate = isValidExcelDate(convertedRow[key]);
              if (isDate) {
                // Convert Excel serial date to ISO format
                convertedRow[key] = convertExcelDateToISO(convertedRow[key]);
              }
            }
          }
        }
        return convertedRow;
      });

      setDataState(convertedData);
      setData(convertedData);

      // Clear the file input
      fileInput.value = "";
    };
    reader.readAsArrayBuffer(file);
  };

  // Utility function to check if a number is a valid Excel date
  const isValidExcelDate = (value) => {
    // Typically, Excel dates start at 1900-01-01 which corresponds to serial number 1
    // and most real-world dates won't go beyond some future number.
    return value > 0 && value < 2958465; // ~9999-12-31
  };

  // Utility function to convert Excel serial date to ISO format
  const convertExcelDateToISO = (excelSerialDate) => {
    // Excel's starting date is 1900-01-01, so add that many days to it
    const epoch = new Date(1900, 0, 1); // January 1, 1900
    const days = excelSerialDate - 1; // Excel wrongly assumes 1900 was a leap year
    return new Date(epoch.getTime() + days * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0]; // Keep only the date part
  };

  return (
    <div className="p-4 mx-auto">
      <div className="mb-4 grid md:grid-cols-2 gap-4">
        <Label htmlFor="excelFile" className="cursor-pointer relative">
          <Button className=" w-full">
            Upload Excel File
            <Upload />
          </Button>
          <Input
            id="excelFile"
            type="file"
            accept=".xlsx"
            onChange={handleFileUpload}
            className="mt-1 absolute top-0 opacity-0 cursor-pointer"
          />
        </Label>
        {dataState.length > 0 && (
          <Button
            onClick={() => {
              setData([]);
              setDataState([]);
            }}
            disabled={dataState.length === 0}
            variant="secondary"
          >
            Clear Data
          </Button>
        )}
      </div>

      {dataState.length > 0 && <ShowDataInTable data={dataState} />}
    </div>
  );
}

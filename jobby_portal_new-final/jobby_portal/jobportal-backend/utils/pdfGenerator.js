// utils/pdfGenerator.js
import { create } from "html-pdf";
import { existsSync, mkdirSync } from "fs";
import { join } from "path";
import { v4 as uuidv4 } from "uuid";

export const generatePdfFromHtml = (htmlString, outputDir = "./uploads") => {
  return new Promise((resolve, reject) => {
    if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });

    const filename = `${uuidv4()}.pdf`;
    const outputPath = join(outputDir, filename);

    const options = {
      format: "A4",
      border: "10mm",
    };

    create(htmlString, options).toFile(outputPath, (err, res) => {
      if (err) return reject(err);
      resolve({ path: outputPath, filename });
    });
  });
};

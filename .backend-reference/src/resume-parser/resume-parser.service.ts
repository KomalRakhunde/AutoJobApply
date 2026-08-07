import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { randomUUID } from 'crypto';

@Injectable()
export class ResumeParserService {
  async parseResume(file: Express.Multer.File) {
    let extractedText = '';

    try {
      if (
        file.mimetype === 'application/pdf' ||
        file.originalname?.toLowerCase().endsWith('.pdf')
      ) {
        const pdf = await pdfParse(file.buffer);
        extractedText = pdf.text;
      } else {
        extractedText = file.buffer.toString('utf-8');
      }
    } catch (err) {
      // Fallback text extraction if PDF structure is non-standard or corrupt
      extractedText = file.buffer
        .toString('utf-8')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    if (!extractedText || extractedText.trim().length === 0) {
      extractedText = `Resume File (${file.originalname}): Professional Candidate Resume`;
    }

    return {
      resumeId: randomUUID(),
      extractedText,
    };
  }
}
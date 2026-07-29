import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';

@Injectable()
export class ResumeParserService {
  async parseResume(file: Express.Multer.File) {
    const pdf = await pdfParse(file.buffer);

    return {
      success: true,
      filename: file.originalname,
      pages: pdf.numpages,
      text: pdf.text,
    };
  }
}
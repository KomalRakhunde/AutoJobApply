import { Injectable } from '@nestjs/common';
import pdfParse from 'pdf-parse';
import { randomUUID } from 'crypto';

@Injectable()
export class ResumeParserService {
  async parseResume(file: Express.Multer.File) {
    const pdf = await pdfParse(file.buffer);

    return {
      resumeId: randomUUID(),
      extractedText: pdf.text,
    };
  }
}
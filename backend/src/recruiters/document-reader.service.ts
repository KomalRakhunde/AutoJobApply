import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as pdfParseModule from 'pdf-parse';
import * as mammoth from 'mammoth';
import AdmZip from 'adm-zip';

export interface DocumentReaderResult {
  extractedText: string;
  fileType: 'PDF' | 'DOCX';
  hasTables: boolean;
}

@Injectable()
export class DocumentReaderService {
  private readonly logger = new Logger(DocumentReaderService.name);

  private getPdfParser(): any {
    if (typeof pdfParseModule === 'function') {
      return pdfParseModule;
    }
    return (pdfParseModule as any).default || pdfParseModule;
  }

  async readResumeDocument(file: Express.Multer.File): Promise<DocumentReaderResult> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new BadRequestException('Empty or missing resume file buffer.');
    }

    const filename = (file.originalname || '').toLowerCase();
    const mimetype = (file.mimetype || '').toLowerCase();

    const isPdf =
      mimetype === 'application/pdf' ||
      filename.endsWith('.pdf') ||
      file.buffer.toString('utf-8', 0, 5).startsWith('%PDF-');

    const isDocx =
      mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      filename.endsWith('.docx') ||
      (file.buffer.length > 4 && file.buffer[0] === 0x50 && file.buffer[1] === 0x4b); // PK zip header

    if (!isPdf && !isDocx) {
      throw new BadRequestException(
        `Unsupported file format (${filename || mimetype}). Only .pdf and .docx resume files are supported.`,
      );
    }

    if (isPdf) {
      return this.extractPdfText(file);
    } else {
      return this.extractDocxText(file);
    }
  }

  private async extractPdfText(file: Express.Multer.File): Promise<DocumentReaderResult> {
    const parsePdf = this.getPdfParser();
    try {
      const pdf = await parsePdf(file.buffer);
      const text = pdf?.text ? pdf.text.trim() : '';
      if (!text) {
        throw new Error('PDF produced empty text');
      }
      return {
        extractedText: text,
        fileType: 'PDF',
        hasTables: false,
      };
    } catch (err: any) {
      this.logger.warn(`PDF parsing warning for ${file.originalname}: ${err?.message}`);
      const fallback = file.buffer
        .toString('utf-8')
        .replace(/[^\x20-\x7E\n\r\t]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
      return {
        extractedText: fallback || `Candidate Resume (${file.originalname})`,
        fileType: 'PDF',
        hasTables: false,
      };
    }
  }

  private async extractDocxText(file: Express.Multer.File): Promise<DocumentReaderResult> {
    let rawParagraphText = '';
    let extractedTableText = '';
    let hasTables = false;

    // 1. Extract Paragraph Text using mammoth
    try {
      const result = await mammoth.extractRawText({ buffer: file.buffer });
      rawParagraphText = (result.value || '').trim();
    } catch (err: any) {
      this.logger.warn(`Mammoth docx extraction warning: ${err?.message}`);
    }

    // 2. Extract Table Text explicitly using AdmZip XML parsing of word/document.xml
    try {
      const zip = new AdmZip(file.buffer);
      const zipEntries = zip.getEntries();
      const docXmlEntry = zipEntries.find((entry) => entry.entryName === 'word/document.xml');

      if (docXmlEntry) {
        const xmlText = docXmlEntry.getData().toString('utf-8');
        
        // Find all <w:tbl> table elements
        const tableMatches = xmlText.match(/<w:tbl[\s\S]*?<\/w:tbl>/gi);
        if (tableMatches && tableMatches.length > 0) {
          hasTables = true;
          const tableRows: string[] = [];

          for (const tblXml of tableMatches) {
            // Find all <w:tr> table row elements inside table
            const rowMatches = tblXml.match(/<w:tr[\s\S]*?<\/w:tr>/gi);
            if (rowMatches) {
              for (const trXml of rowMatches) {
                // Find all <w:tc> table cell elements inside row
                const cellMatches = trXml.match(/<w:tc[\s\S]*?<\/w:tc>/gi);
                if (cellMatches) {
                  const cellTexts: string[] = [];
                  for (const tcXml of cellMatches) {
                    // Extract text inside <w:t> tags within the cell
                    const textMatches = tcXml.match(/<w:t[^>]*>([\s\S]*?)<\/w:t>/gi);
                    if (textMatches) {
                      const cleanCell = textMatches
                        .map((t) => t.replace(/<[^>]+>/g, '').trim())
                        .filter(Boolean)
                        .join(' ');
                      if (cleanCell) cellTexts.push(cleanCell);
                    }
                  }
                  if (cellTexts.length > 0) {
                    tableRows.push(cellTexts.join(' | '));
                  }
                }
              }
            }
          }

          if (tableRows.length > 0) {
            extractedTableText = `\n--- EXTRACTED RESUME TABLE CONTENTS ---\n` + tableRows.join('\n');
          }
        }
      }
    } catch (zipErr: any) {
      this.logger.warn(`AdmZip table extraction error for DOCX: ${zipErr?.message}`);
    }

    const combined = [rawParagraphText, extractedTableText].filter(Boolean).join('\n\n').trim();

    return {
      extractedText: combined || `Candidate Resume (${file.originalname})`,
      fileType: 'DOCX',
      hasTables,
    };
  }
}

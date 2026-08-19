import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const ALLOWED_RESUME_MIMETYPES = new Set([
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
]);
const ALLOWED_RESUME_EXTENSIONS = /\.(pdf|docx)$/i;

const MAX_RESUME_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB per file

function resumeFileFilter(_req: any, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) {
  const mimetypeOk = ALLOWED_RESUME_MIMETYPES.has(file.mimetype);
  const extensionOk = ALLOWED_RESUME_EXTENSIONS.test(file.originalname || '');
  if (!mimetypeOk && !extensionOk) {
    callback(new BadRequestException('Only PDF and DOCX resume files are allowed'), false);
    return;
  }
  callback(null, true);
}

/**
 * Multer options shared by every resume-upload endpoint. Rejecting
 * oversized/wrong-type files at the multer layer (before the request body
 * is buffered into memory) prevents a burst of large or bogus uploads from
 * exhausting server memory - checking the file type only after it has
 * already been fully read is too late.
 */
export const RESUME_UPLOAD_MULTER_OPTIONS: MulterOptions = {
  limits: {
    fileSize: MAX_RESUME_FILE_SIZE_BYTES,
  },
  fileFilter: resumeFileFilter,
};

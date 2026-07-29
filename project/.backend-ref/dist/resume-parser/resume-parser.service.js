"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResumeParserService = void 0;
const common_1 = require("@nestjs/common");
const pdf_parse_1 = __importDefault(require("pdf-parse"));
const crypto_1 = require("crypto");
let ResumeParserService = class ResumeParserService {
    async parseResume(file) {
        const pdf = await (0, pdf_parse_1.default)(file.buffer);
        return {
            resumeId: (0, crypto_1.randomUUID)(),
            extractedText: pdf.text,
        };
    }
};
exports.ResumeParserService = ResumeParserService;
exports.ResumeParserService = ResumeParserService = __decorate([
    (0, common_1.Injectable)()
], ResumeParserService);
//# sourceMappingURL=resume-parser.service.js.map
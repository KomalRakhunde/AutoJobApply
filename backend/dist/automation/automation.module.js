"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationModule = void 0;
const common_1 = require("@nestjs/common");
const firecrawl_service_1 = require("./firecrawl.service");
const job_extractor_service_1 = require("./job-extractor.service");
const job_validator_service_1 = require("./job-validator.service");
const hn_yc_jobs_adapter_1 = require("./adapters/hn-yc-jobs.adapter");
const remoteok_jobs_adapter_1 = require("./adapters/remoteok-jobs.adapter");
const simplify_jobs_adapter_1 = require("./adapters/simplify-jobs.adapter");
const adapter_registry_service_1 = require("./adapters/adapter-registry.service");
let AutomationModule = class AutomationModule {
};
exports.AutomationModule = AutomationModule;
exports.AutomationModule = AutomationModule = __decorate([
    (0, common_1.Module)({
        providers: [
            job_extractor_service_1.JobExtractorService,
            job_validator_service_1.JobValidatorService,
            firecrawl_service_1.FirecrawlService,
            hn_yc_jobs_adapter_1.HnYcJobsAdapter,
            remoteok_jobs_adapter_1.RemoteOkJobsAdapter,
            simplify_jobs_adapter_1.SimplifyJobsAdapter,
            adapter_registry_service_1.AdapterRegistryService,
        ],
        exports: [
            job_extractor_service_1.JobExtractorService,
            job_validator_service_1.JobValidatorService,
            firecrawl_service_1.FirecrawlService,
            hn_yc_jobs_adapter_1.HnYcJobsAdapter,
            remoteok_jobs_adapter_1.RemoteOkJobsAdapter,
            simplify_jobs_adapter_1.SimplifyJobsAdapter,
            adapter_registry_service_1.AdapterRegistryService,
        ],
    })
], AutomationModule);
//# sourceMappingURL=automation.module.js.map
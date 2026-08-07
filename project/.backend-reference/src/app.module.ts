
import { PrismaModule } from './prisma/prisma.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ResumesModule } from './resumes/resumes.module';
import { JobsModule } from './jobs/jobs.module';
import { AiModule } from './ai/ai.module';
import { ApplicationsModule } from './applications/applications.module';
import { AutomationModule } from './automation/automation.module';
import { GmailModule } from './gmail/gmail.module';
import { NotificationsModule } from './notifications/notifications.module';
import { ProfilesModule } from './profiles/profiles.module';
import { SkillsModule } from './skills/skills.module';
import { CoverLettersModule } from './cover-letters/cover-letters.module';
import { InterviewModule } from './interview/interview.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { SubscriptionsModule } from './subscriptions/subscriptions.module';
import { RecruitersModule } from './recruiters/recruiters.module';
import { AdminModule } from './admin/admin.module';
import { PaymentsModule } from './payments/payments.module';
import { EducationModule } from './education/education.module';
import { ExperienceModule } from './experience/experience.module';
import { CertificationModule } from './certification/certification.module';
import { ResumeParserModule } from './resume-parser/resume-parser.module';
import { StorageModule } from './storage/storage.module';
import { SearchModule } from './search/search.module';
@Module({
  imports: [
  PrismaModule,
  AuthModule,
  UsersModule,
  ResumesModule,
  JobsModule,
  AiModule,
  ApplicationsModule,
  AutomationModule,
  GmailModule,
  NotificationsModule,
  ProfilesModule,
  SkillsModule,
  CoverLettersModule,
  InterviewModule,
  DashboardModule,
  SubscriptionsModule,
  RecruitersModule,
  AdminModule,
  PaymentsModule,
  EducationModule,
  ExperienceModule,
  CertificationModule,
  ResumeParserModule,
  StorageModule,
  SearchModule,
],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

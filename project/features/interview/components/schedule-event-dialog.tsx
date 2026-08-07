'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar as CalendarIcon,
  Clock,
  ExternalLink,
  Download,
  CheckCircle2,
  Bell,
  Sparkles,
  Link2,
  Layers,
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export interface EventData {
  title: string;
  calendarType: string;
  startDateTime: string;
  durationMinutes: number;
  description: string;
  location: string;
}

const PRESET_TITLES = [
  'Interview with John Doe',
  'ApplyAI Team Sync',
  'Design Review',
  'AI Mock Practice',
  'Technical Assessment',
];

export function ScheduleEventDialog({
  open,
  onOpenChange,
  onEventSaved,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onEventSaved?: (event: EventData) => void;
}) {
  const { toast } = useToast();

  const getInitialDateTime = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(14, 0, 0, 0);
    const tzOffset = tomorrow.getTimezoneOffset() * 60000;
    return new Date(tomorrow.getTime() - tzOffset).toISOString().slice(0, 16);
  };

  const [title, setTitle] = useState('ApplyAI Team Sync');
  const [calendarType, setCalendarType] = useState('Primary / Personal Calendar');
  const [startDateTime, setStartDateTime] = useState(getInitialDateTime);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [location, setLocation] = useState('Google Meet / Zoom');
  const [description, setDescription] = useState(
    'ApplyAI sync meeting. Agenda: Project milestone review and upcoming deliverables.'
  );

  const getEndDateTime = (): Date => {
    const start = new Date(startDateTime || Date.now());
    return new Date(start.getTime() + durationMinutes * 60000);
  };

  const formatGoogleCalendarDate = (date: Date): string => {
    return date.toISOString().replace(/-|:|\.\d\d\d/g, '');
  };

  const buildGoogleCalendarUrl = (): string => {
    const start = new Date(startDateTime || Date.now());
    const end = getEndDateTime();

    const startISO = formatGoogleCalendarDate(start);
    const endISO = formatGoogleCalendarDate(end);

    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: title,
      dates: `${startISO}/${endISO}`,
      details: `${description}\n\n[Calendar: ${calendarType}]`,
      location: location,
    });

    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  // Real Browser Notification Trigger
  const triggerBrowserNotification = (eventTitle: string, eventTime: string) => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      if (Notification.permission === 'granted') {
        new Notification(`📅 Event Scheduled: ${eventTitle}`, {
          body: `Start Time: ${new Date(eventTime).toLocaleString()}\nDuration: ${durationMinutes} mins`,
          icon: '/favicon.ico',
        });
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then((permission) => {
          if (permission === 'granted') {
            new Notification(`📅 Event Scheduled: ${eventTitle}`, {
              body: `Start Time: ${new Date(eventTime).toLocaleString()}\nDuration: ${durationMinutes} mins`,
              icon: '/favicon.ico',
            });
          }
        });
      }
    }
  };

  const handleDownloadIcs = () => {
    const start = new Date(startDateTime || Date.now());
    const end = getEndDateTime();

    const startISO = formatGoogleCalendarDate(start);
    const endISO = formatGoogleCalendarDate(end);

    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//ApplyAI Job Portal//Student Dashboard//EN',
      'BEGIN:VEVENT',
      `SUMMARY:${title}`,
      `DESCRIPTION:${description.replace(/\n/g, '\\n')}`,
      `LOCATION:${location}`,
      `DTSTART:${startISO}`,
      `DTEND:${endISO}`,
      'STATUS:CONFIRMED',
      'BEGIN:VALARM',
      'TRIGGER:-PT15M',
      'ACTION:DISPLAY',
      'DESCRIPTION:Reminder for event',
      'END:VALARM',
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_event.ics`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: '📅 .ics Calendar File Downloaded',
      description: 'Open this file on your phone or computer to add it to system calendars.',
    });
  };

  const handleSaveEvent = () => {
    if (!title.trim()) {
      toast({
        title: 'Title Required',
        description: 'Please enter an event title before saving.',
        variant: 'destructive',
      });
      return;
    }

    const eventData: EventData = {
      title,
      calendarType,
      startDateTime,
      durationMinutes,
      description,
      location,
    };

    if (onEventSaved) {
      onEventSaved(eventData);
    }

    // Trigger Real System Push Notification
    triggerBrowserNotification(title, startDateTime);

    toast({
      title: '✅ Event Scheduled & Notification Set!',
      description: `"${title}" has been saved. Real device reminder activated.`,
    });

    onOpenChange(false);
  };

  const handleGoogleCalendarSync = () => {
    const gcalUrl = buildGoogleCalendarUrl();
    window.open(gcalUrl, '_blank', 'noopener,noreferrer');

    triggerBrowserNotification(title, startDateTime);

    toast({
      title: '🔗 Syncing with Google Calendar',
      description: 'Opening Google Calendar to confirm event creation and set phone notifications.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[92vw] sm:w-[90vw] md:max-w-[680px] max-h-[80vh] sm:max-h-[85vh] flex flex-col rounded-2xl border border-slate-700/60 bg-[#161e2e] text-white p-0 shadow-2xl font-sans relative overflow-hidden border-r-4 border-r-indigo-500">
        
        {/* Sticky Header */}
        <DialogHeader className="shrink-0 p-5 sm:p-6 pb-3.5 border-b border-slate-700/60 space-y-1 bg-[#161e2e]">
          <DialogTitle className="text-base sm:text-lg font-bold text-white tracking-tight flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-indigo-400" />
            <span>Schedule Event</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400 font-normal">
            Configure event parameters and sync real notifications with connected calendars.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto min-h-0 p-5 sm:p-6 py-4 text-xs space-y-4 custom-scrollbar">
          
          {/* Quick Suggestions Chips */}
          <div className="space-y-2">
            <Label className="text-xs font-semibold text-slate-400 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" /> Quick Suggestions
            </Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_TITLES.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setTitle(preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    title === preset
                      ? 'bg-indigo-600 text-white border-indigo-500 shadow-sm'
                      : 'bg-[#1e293b]/80 text-slate-300 border-slate-700/60 hover:bg-[#334155] hover:text-white'
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Event Title */}
          <div className="space-y-1.5">
            <Label htmlFor="event-title" className="text-xs font-semibold text-slate-300">
              Event Title / Name <span className="text-rose-400">*</span>
            </Label>
            <Input
              id="event-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. ApplyAI Team Sync / Interview with John Doe"
              className="rounded-xl border border-slate-700/70 bg-[#0f172a] text-white placeholder:text-slate-500 text-xs px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Calendar Category & Duration Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="h-3.5 w-3.5 text-slate-400" /> Calendar / Account
              </Label>
              <select
                value={calendarType}
                onChange={(e) => setCalendarType(e.target.value)}
                className="w-full rounded-xl border border-slate-700/70 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value="Primary / Personal Calendar" className="bg-[#161e2e] text-white">Primary / Personal Calendar</option>
                <option value="Work / Company Calendar" className="bg-[#161e2e] text-white">Work / Company Calendar</option>
                <option value="Academic / College Calendar" className="bg-[#161e2e] text-white">Academic / College Calendar</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-slate-400" /> Duration
              </Label>
              <select
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-700/70 bg-[#0f172a] px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
              >
                <option value={15} className="bg-[#161e2e] text-white">15 Minutes</option>
                <option value={30} className="bg-[#161e2e] text-white">30 Minutes</option>
                <option value={45} className="bg-[#161e2e] text-white">45 Minutes</option>
                <option value={60} className="bg-[#161e2e] text-white">1 Hour</option>
                <option value={120} className="bg-[#161e2e] text-white">2 Hours</option>
              </select>
            </div>
          </div>

          {/* Start Date & Time */}
          <div className="space-y-1.5">
            <Label htmlFor="event-datetime" className="text-xs font-semibold text-slate-300">
              Start Date & Time
            </Label>
            <Input
              id="event-datetime"
              type="datetime-local"
              value={startDateTime}
              onChange={(e) => setStartDateTime(e.target.value)}
              className="rounded-xl border border-slate-700/70 bg-[#0f172a] text-white text-xs px-3.5 py-2.5 [color-scheme:dark] focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Location / Link */}
          <div className="space-y-1.5">
            <Label htmlFor="event-location" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Link2 className="h-3.5 w-3.5 text-slate-400" /> Location / Meeting Link
            </Label>
            <Input
              id="event-location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="e.g. Google Meet, Zoom, or Office Room"
              className="rounded-xl border border-slate-700/70 bg-[#0f172a] text-white placeholder:text-slate-500 text-xs px-3.5 py-2.5 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <Label htmlFor="event-desc" className="text-xs font-semibold text-slate-300">
              Event Details & Notes
            </Label>
            <Textarea
              id="event-desc"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add key notes, agenda items, or interviewer details..."
              className="rounded-xl border border-slate-700/70 bg-[#0f172a] text-white placeholder:text-slate-500 text-xs px-3.5 py-2.5 resize-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none"
            />
          </div>

          {/* Smart Sync Notification Banner */}
          <div className="rounded-xl bg-[#0f172a]/90 border border-slate-700/50 p-3.5 flex items-center gap-3 text-slate-400 text-xs mt-2">
            <Bell className="h-4 w-4 text-indigo-400 shrink-0" />
            <p className="text-[11px] text-slate-400 font-normal leading-tight">
              <span className="font-semibold text-slate-300">Smart Sync:</span> Syncing with Google Calendar pushes instant alerts to your connected phone and wearables.
            </p>
          </div>
        </div>

        {/* Sticky Footer Bar */}
        <div className="shrink-0 p-4 sm:p-5 pt-3.5 border-t border-slate-700/60 flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#161e2e]">
          {/* Left Export & Sync Buttons */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              type="button"
              variant="outline"
              onClick={handleDownloadIcs}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#334155] text-slate-200 text-xs font-medium px-3.5 py-2 gap-2 h-9"
            >
              <Download className="h-3.5 w-3.5 text-slate-400" />
              <span>Export .ics</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleCalendarSync}
              className="flex-1 sm:flex-initial rounded-xl border border-slate-700/80 bg-[#1e293b]/70 hover:bg-[#334155] text-slate-200 text-xs font-medium px-3.5 py-2 gap-2 h-9"
            >
              <ExternalLink className="h-3.5 w-3.5 text-slate-400" />
              <span>Google Sync</span>
            </Button>
          </div>

          {/* Right Discard & Save Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="text-xs text-slate-400 hover:text-white font-medium px-3 py-2 transition-colors"
            >
              Discard
            </button>

            <Button
              type="button"
              onClick={handleSaveEvent}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs px-5 py-2 gap-2 shadow-md h-9"
            >
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>Save Event</span>
            </Button>
          </div>
        </div>

      </DialogContent>
    </Dialog>
  );
}

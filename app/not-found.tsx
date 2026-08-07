import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Sparkles, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-slate-50 px-4 text-center dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 mb-6">
        <Sparkles className="h-6 w-6" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">404</h1>
      <p className="mt-3 text-base text-slate-500 dark:text-slate-400 max-w-md">
        Oops! The page you are looking for does not exist or has been moved.
      </p>
      <div className="mt-8">
        <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white" asChild>
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4" /> Return to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

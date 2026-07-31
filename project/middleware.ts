import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Retrieve auth token and role from cookies or headers
  const tokenCookie = request.cookies.get('applyai_token')?.value;
  const roleCookie = (request.cookies.get('applyai_role')?.value || 'student').toLowerCase();

  // Define route protection boundaries
  const isDashboardRoute = pathname.startsWith('/dashboard');
  const isRecruiterRoute = pathname.startsWith('/dashboard/recruiter') || pathname.startsWith('/sourcing');
  const isAdminRoute = pathname.startsWith('/dashboard/admin') || pathname === '/admin';
  const isSuperAdminRoute = pathname.startsWith('/dashboard/super-admin') || pathname === '/super-admin';
  const isStudentRoute = pathname.startsWith('/dashboard/student');

  // IF UNAUTHENTICATED & ATTEMPTING PROTECTED DASHBOARD
  if (!tokenCookie && isDashboardRoute) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ROLE ISOLATION & DOMAIN SECURITY GUARDS
  if (tokenCookie) {
    // 1. STUDENT ROLE INTERCEPTION
    if (roleCookie === 'student') {
      if (isRecruiterRoute || isAdminRoute || isSuperAdminRoute) {
        // Reject privilege escalation attempt & redirect back to student portal
        const studentDashboard = new URL('/dashboard/student', request.url);
        studentDashboard.searchParams.set('error', 'unauthorized_role_access');
        return NextResponse.redirect(studentDashboard);
      }
    }

    // 2. RECRUITER ROLE INTERCEPTION
    if (roleCookie === 'recruiter') {
      if (isAdminRoute || isSuperAdminRoute) {
        const recruiterDashboard = new URL('/dashboard/recruiter', request.url);
        recruiterDashboard.searchParams.set('error', 'unauthorized_role_access');
        return NextResponse.redirect(recruiterDashboard);
      }
    }

    // 3. ADMIN ROLE INTERCEPTION
    if (roleCookie === 'admin') {
      if (isSuperAdminRoute) {
        const adminDashboard = new URL('/dashboard/admin', request.url);
        adminDashboard.searchParams.set('error', 'unauthorized_role_access');
        return NextResponse.redirect(adminDashboard);
      }
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/sourcing/:path*',
    '/applications/:path*',
    '/email-sync/:path*',
    '/admin/:path*',
    '/super-admin/:path*',
  ],
};

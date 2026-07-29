'use client';

import { useEffect, useState } from 'react';
import { useAppSelector } from '@/lib/store/hooks';
import { useGetProfile, useUpdateProfile } from '@/lib/hooks/use-profile';
import { useGetUser, useUpdateUser } from '@/lib/hooks/use-auth';
import { AppNav } from '@/components/app-nav';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import {
  Loader2,
  Save,
  AlertCircle,
  MapPin,
  Phone,
  Link2,
  DollarSign,
  Clock,
  User as UserIcon,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAppSelector((s) => s.auth);
  const userId = user?.id;
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading, error: profileError } =
    useGetProfile(userId);
  const updateProfile = useUpdateProfile();
  const getUser = useGetUser(userId ?? '', !!userId);
  const updateUser = useUpdateUser();

  const [userForm, setUserForm] = useState({ firstName: '', lastName: '' });
  const [profileForm, setProfileForm] = useState({
    phone: '',
    location: '',
    preferredLocation: '',
    expectedSalary: '',
    noticePeriod: '',
    linkedinUrl: '',
    portfolioUrl: '',
    githubUrl: '',
  });
  const [profileExists, setProfileExists] = useState(true);

  useEffect(() => {
    if (getUser.data) {
      setUserForm({
        firstName: getUser.data.firstName ?? '',
        lastName: getUser.data.lastName ?? '',
      });
    }
  }, [getUser.data]);

  useEffect(() => {
    if (profile) {
      setProfileForm({
        phone: profile.phone ?? '',
        location: profile.location ?? '',
        preferredLocation: profile.preferredLocation ?? '',
        expectedSalary: profile.expectedSalary ?? '',
        noticePeriod: profile.noticePeriod ?? '',
        linkedinUrl: profile.linkedinUrl ?? '',
        portfolioUrl: profile.portfolioUrl ?? '',
        githubUrl: profile.githubUrl ?? '',
      });
      setProfileExists(true);
    }
  }, [profile]);

  useEffect(() => {
    if (profileError && profileError.status === 404) {
      setProfileExists(false);
    }
  }, [profileError]);

  const onUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    try {
      await updateUser.mutateAsync({
        id: userId,
        body: {
          firstName: userForm.firstName.trim() || undefined,
          lastName: userForm.lastName.trim() || undefined,
        },
      });
      toast({ title: 'Saved', description: 'Your name has been updated.' });
    } catch (err) {
      toast({
        title: 'Could not save',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const onProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;
    const body = Object.fromEntries(
      Object.entries(profileForm)
        .filter(([, v]) => v.trim() !== '')
        .map(([k, v]) => [k, v.trim()])
    );
    try {
      await updateProfile.mutateAsync({ userId, body });
      setProfileExists(true);
      toast({
        title: 'Saved',
        description: profileExists
          ? 'Your profile has been updated.'
          : 'Your profile has been created.',
      });
    } catch (err) {
      toast({
        title: 'Could not save',
        description: err instanceof Error ? err.message : 'Please try again.',
        variant: 'destructive',
      });
    }
  };

  const setProfile = (key: keyof typeof profileForm, value: string) =>
    setProfileForm((f) => ({ ...f, [key]: value }));

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <AppNav />
        <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Your Profile
            </h1>
            <p className="mt-2 text-muted-foreground">
              Keep your details up to date so AI tools can tailor recommendations.
            </p>
          </div>

          <div className="mt-8 space-y-6">
            {/* Personal info */}
            <Card className="animate-fade-in-up animate-delay-100">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <UserIcon className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Personal information</CardTitle>
                    <CardDescription>Your name and account email.</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={onUserSubmit} className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="firstName">First name</Label>
                      <Input
                        id="firstName"
                        value={userForm.firstName}
                        onChange={(e) =>
                          setUserForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                        placeholder="Jane"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="lastName">Last name</Label>
                      <Input
                        id="lastName"
                        value={userForm.lastName}
                        onChange={(e) =>
                          setUserForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        placeholder="Doe"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      value={user?.email ?? ''}
                      disabled
                      className="bg-muted/50"
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed here.
                    </p>
                  </div>
                  <Button
                    type="submit"
                    className="gap-2"
                    disabled={updateUser.isPending}
                  >
                    {updateUser.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    Save name
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Profile details */}
            <Card className="animate-fade-in-up animate-delay-200">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <CardTitle>Career details</CardTitle>
                    <CardDescription>
                      Location, salary expectations, links, and preferences.
                      {!profileExists && (
                        <span className="mt-1 block text-warning">
                          No profile yet — filling this in will create one.
                        </span>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {profileLoading ? (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Loader2 className="h-4 w-4 animate-spin" /> Loading your profile…
                  </div>
                ) : profileError && profileError.status !== 404 ? (
                  <div className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
                    <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                    <span>{profileError.message}</span>
                  </div>
                ) : (
                  <form onSubmit={onProfileSubmit} className="space-y-5">
                    <Section label="Contact">
                      <Field icon={Phone} label="Phone" id="phone">
                        <Input
                          id="phone"
                          value={profileForm.phone}
                          onChange={(e) => setProfile('phone', e.target.value)}
                          placeholder="+1 555 000 0000"
                        />
                      </Field>
                    </Section>

                    <Section label="Location & preferences">
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field icon={MapPin} label="Current location" id="location">
                          <Input
                            id="location"
                            value={profileForm.location}
                            onChange={(e) => setProfile('location', e.target.value)}
                            placeholder="San Francisco, CA"
                          />
                        </Field>
                        <Field
                          icon={MapPin}
                          label="Preferred location"
                          id="preferredLocation"
                        >
                          <Input
                            id="preferredLocation"
                            value={profileForm.preferredLocation}
                            onChange={(e) =>
                              setProfile('preferredLocation', e.target.value)
                            }
                            placeholder="Remote / New York"
                          />
                        </Field>
                      </div>
                      <div className="grid gap-4 sm:grid-cols-2">
                        <Field icon={DollarSign} label="Expected salary" id="expectedSalary">
                          <Input
                            id="expectedSalary"
                            value={profileForm.expectedSalary}
                            onChange={(e) =>
                              setProfile('expectedSalary', e.target.value)
                            }
                            placeholder="$120,000"
                          />
                        </Field>
                        <Field icon={Clock} label="Notice period" id="noticePeriod">
                          <Input
                            id="noticePeriod"
                            value={profileForm.noticePeriod}
                            onChange={(e) =>
                              setProfile('noticePeriod', e.target.value)
                            }
                            placeholder="2 weeks"
                          />
                        </Field>
                      </div>
                    </Section>

                    <Section label="Online presence">
                      <Field icon={Link2} label="LinkedIn URL" id="linkedinUrl">
                        <Input
                          id="linkedinUrl"
                          value={profileForm.linkedinUrl}
                          onChange={(e) => setProfile('linkedinUrl', e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                        />
                      </Field>
                      <Field icon={Link2} label="Portfolio URL" id="portfolioUrl">
                        <Input
                          id="portfolioUrl"
                          value={profileForm.portfolioUrl}
                          onChange={(e) => setProfile('portfolioUrl', e.target.value)}
                          placeholder="https://yourportfolio.com"
                        />
                      </Field>
                      <Field icon={Link2} label="GitHub URL" id="githubUrl">
                        <Input
                          id="githubUrl"
                          value={profileForm.githubUrl}
                          onChange={(e) => setProfile('githubUrl', e.target.value)}
                          placeholder="https://github.com/username"
                        />
                      </Field>
                    </Section>

                    <Button
                      type="submit"
                      className="gap-2"
                      disabled={updateProfile.isPending}
                    >
                      {updateProfile.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Save className="h-4 w-4" />
                      )}
                      {profileExists ? 'Save changes' : 'Create profile'}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </AuthGuard>
  );
}

function Section({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </h3>
      {children}
    </div>
  );
}

function Field({
  icon: Icon,
  label,
  id,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="flex items-center gap-1.5 text-muted-foreground">
        <Icon className="h-3.5 w-3.5" /> {label}
      </Label>
      {children}
    </div>
  );
}

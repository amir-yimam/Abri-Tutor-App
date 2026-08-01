import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { localTutors, localApplications, localAttendance, localJobs } from '@/src/services/backend';
import type { Application, Attendance, Job, TutorProfile } from '@/src/types';
export function useTutorData() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [applications, setApplications] = useState<Application[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [p, apps, att] = await Promise.all([
      localTutors.get(user.uid),
      localApplications.byTutor(user.uid),
      localAttendance.byTutor(user.uid),
    ]);
    setProfile(p);
    setApplications(apps);
    setAttendance(att);
    setLoading(false);
  }, [user]);
useEffect(() => {
    load();
  }, [load]);

  const acceptedApplications = applications.filter((a) => a.status === 'accepted');
  const activeStudents = acceptedApplications.length;
  const todayDate = new Date().toISOString().split('T')[0];
  const todayClasses = attendance.filter((a) => a.date === todayDate);
  const now = Date.now();
  const monthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime();
  const monthEarnings = acceptedApplications.reduce((sum, a) => {
    const job = a.job;
    if (job && a.appliedAt >= monthStart) return sum + job.fee;
    return sum;
  }, 0);

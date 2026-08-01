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

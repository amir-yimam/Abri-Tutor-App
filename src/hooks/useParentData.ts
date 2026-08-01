import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { localJobs, localReports, localParents } from '@/src/services/backend';
import type { Job, ParentProfile, Report } from '@/src/types';

export function useParentData() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [profile, setProfile] = useState<ParentProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    const [j, r, p] = await Promise.all([
      localJobs.byParent(user.uid),
      localReports.byParent(user.uid),
      localParents.get(user.uid),
    ]);
    setJobs(j);
    setReports(r);
    setProfile(p);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const activeTutors = new Set(jobs.filter((j) => j.assignedTutorId).map((j) => j.assignedTutorId!)).size;
  const activeChildren = new Set(jobs.map((j) => j.childName)).size;
  const monthlySpend = jobs
    .filter((j) => j.status !== 'open' && j.createdAt >= new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime())
    .reduce((sum, j) => sum + j.fee, 0);

  return { jobs, reports, profile, activeTutors, activeChildren, monthlySpend, loading, reload: load };
}

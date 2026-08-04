import { supabase } from '@/src/services/supabase';
import type {
  Application,
  Attendance,
  BaseUser,
  Job,
  ParentProfile,
  ParentReport,
  Rating,
  Report,
  Role,
  TutorAttendance,
  TutorProfile,
} from '@/src/types';

// ---------- Tutor profiles ----------
export const dbTutors = {
  async get(uid: string): Promise<TutorProfile | null> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .eq('uid', uid)
      .maybeSingle();
    if (error || !data) return null;
    return {
      uid: data.uid,
      personalInfo: data.personal_info,
      education: data.education,
      experience: data.experience,
      availability: data.availability,
      languages: data.languages,
      videoUrl: data.video_url,
      isProfileComplete: data.is_profile_complete,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async save(profile: TutorProfile): Promise<void> {
    const { error } = await supabase
      .from('tutor_profiles')
      .upsert({
        uid: profile.uid,
        personal_info: profile.personalInfo,
        education: profile.education,
        experience: profile.experience,
        availability: profile.availability,
        languages: profile.languages,
        video_url: profile.videoUrl,
        is_profile_complete: profile.isProfileComplete,
        updated_at: Date.now(),
      });
    if (error) throw new Error(error.message);
  },

  async all(): Promise<TutorProfile[]> {
    const { data, error } = await supabase
      .from('tutor_profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapTutorProfile);
  },
};

function mapTutorProfile(data: Record<string, unknown>): TutorProfile {
  return {
    uid: data.uid as string,
    personalInfo: data.personal_info as TutorProfile['personalInfo'],
    education: data.education as TutorProfile['education'],
    experience: data.experience as TutorProfile['experience'],
    availability: data.availability as TutorProfile['availability'],
    languages: data.languages as TutorProfile['languages'],
    videoUrl: (data.video_url as string) ?? '',
    isProfileComplete: data.is_profile_complete as boolean,
    createdAt: data.created_at as number,
    updatedAt: data.updated_at as number,
  };
}

// ---------- Parent profiles ----------
export const dbParents = {
  async get(uid: string): Promise<ParentProfile | null> {
    const { data, error } = await supabase
      .from('parent_profiles')
      .select('*')
      .eq('uid', uid)
      .maybeSingle();
    if (error || !data) return null;
    return {
      uid: data.uid,
      children: data.children,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  },

  async save(profile: ParentProfile): Promise<void> {
    const { error } = await supabase
      .from('parent_profiles')
      .upsert({
        uid: profile.uid,
        children: profile.children,
        updated_at: Date.now(),
      });
    if (error) throw new Error(error.message);
  },
};

// ---------- Jobs ----------
export const dbJobs = {
  async create(job: Omit<Job, 'id' | 'createdAt'>): Promise<Job> {
    const { data, error } = await supabase
      .from('jobs')
      .insert({
        title: job.title,
        child_name: job.childName,
        subject: job.subject,
        grade: job.grade,
        location: job.location,
        fee: job.fee,
        schedule: job.schedule,
        preferences: job.preferences,
        status: job.status,
        parent_id: job.parentId,
        parent_name: job.parentName,
        assigned_tutor_id: job.assignedTutorId,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapJob(data);
  },

  async update(id: string, patch: Partial<Job>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (patch.title !== undefined) updateData.title = patch.title;
    if (patch.childName !== undefined) updateData.child_name = patch.childName;
    if (patch.subject !== undefined) updateData.subject = patch.subject;
    if (patch.grade !== undefined) updateData.grade = patch.grade;
    if (patch.location !== undefined) updateData.location = patch.location;
    if (patch.fee !== undefined) updateData.fee = patch.fee;
    if (patch.schedule !== undefined) updateData.schedule = patch.schedule;
    if (patch.preferences !== undefined) updateData.preferences = patch.preferences;
    if (patch.status !== undefined) updateData.status = patch.status;
    if (patch.assignedTutorId !== undefined) updateData.assigned_tutor_id = patch.assignedTutorId;

    const { error } = await supabase.from('jobs').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async delete(id: string): Promise<void> {
    const { error } = await supabase.from('jobs').delete().eq('id', id);
    if (error) throw new Error(error.message);
  },

  async get(id: string): Promise<Job | null> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('id', id)
      .maybeSingle();
    if (error || !data) return null;
    return mapJob(data);
  },

  async all(): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapJob);
  },

  async byParent(parentId: string): Promise<Job[]> {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapJob);
  },

  async updateStatus(id: string, status: Job['status'], assignedTutorId: string | null): Promise<void> {
    const { error } = await supabase
      .from('jobs')
      .update({ status, assigned_tutor_id: assignedTutorId })
      .eq('id', id);
    if (error) throw new Error(error.message);
  },
};

function mapJob(data: Record<string, unknown>): Job {
  return {
    id: data.id as string,
    title: data.title as string,
    childName: data.child_name as string,
    subject: data.subject as Job['subject'],
    grade: data.grade as Job['grade'],
    location: data.location as string,
    fee: data.fee as number,
    schedule: data.schedule as string,
    preferences: data.preferences as string,
    status: data.status as Job['status'],
    parentId: data.parent_id as string,
    parentName: data.parent_name as string,
    assignedTutorId: (data.assigned_tutor_id as string | null) ?? null,
    createdAt: data.created_at as number,
  };
}

// ---------- Applications ----------
export const dbApplications = {
  async create(app: Omit<Application, 'id' | 'appliedAt'>): Promise<Application> {
    const { data, error } = await supabase
      .from('applications')
      .insert({
        job_id: app.jobId,
        tutor_id: app.tutorId,
        tutor_name: app.tutorName,
        parent_id: app.parentId,
        status: app.status,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapApplication(data);
  },

  async byTutor(tutorId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('tutor_id', tutorId)
      .order('applied_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: Record<string, unknown>) => {
      const app = mapApplication(row);
      if (row.jobs) app.job = mapJob(row.jobs as Record<string, unknown>);
      return app;
    });
  },

  async byJob(jobId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .eq('job_id', jobId)
      .order('applied_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapApplication);
  },

  async byParent(parentId: string): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .eq('parent_id', parentId)
      .order('applied_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: Record<string, unknown>) => {
      const app = mapApplication(row);
      if (row.jobs) app.job = mapJob(row.jobs as Record<string, unknown>);
      return app;
    });
  },

  async update(id: string, patch: Partial<Application>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (patch.status !== undefined) updateData.status = patch.status;
    const { error } = await supabase.from('applications').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async all(): Promise<Application[]> {
    const { data, error } = await supabase
      .from('applications')
      .select('*, jobs(*)')
      .order('applied_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((row: Record<string, unknown>) => {
      const app = mapApplication(row);
      if (row.jobs) app.job = mapJob(row.jobs as Record<string, unknown>);
      return app;
    });
  },
};

function mapApplication(data: Record<string, unknown>): Application {
  return {
    id: data.id as string,
    jobId: data.job_id as string,
    tutorId: data.tutor_id as string,
    tutorName: data.tutor_name as string,
    parentId: data.parent_id as string,
    status: data.status as Application['status'],
    appliedAt: data.applied_at as number,
  };
}

// ---------- Attendance ----------
export const dbAttendance = {
  async create(rec: Omit<Attendance, 'id'>): Promise<Attendance> {
    const { data, error } = await supabase
      .from('attendance')
      .insert({
        tutor_id: rec.tutorId,
        student_id: rec.studentId,
        student_name: rec.studentName,
        subject: rec.subject,
        date: rec.date,
        start_time: rec.startTime,
        end_time: rec.endTime,
        hours: rec.hours,
        status: rec.status,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapAttendance(data);
  },

  async update(id: string, patch: Partial<Attendance>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (patch.startTime !== undefined) updateData.start_time = patch.startTime;
    if (patch.endTime !== undefined) updateData.end_time = patch.endTime;
    if (patch.hours !== undefined) updateData.hours = patch.hours;
    if (patch.status !== undefined) updateData.status = patch.status;
    const { error } = await supabase.from('attendance').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async byTutor(tutorId: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('date', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapAttendance);
  },

  async byTutorAndDate(tutorId: string, date: string): Promise<Attendance[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('tutor_id', tutorId)
      .eq('date', date)
      .order('start_time', { ascending: true });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapAttendance);
  },
};

function mapAttendance(data: Record<string, unknown>): Attendance {
  return {
    id: data.id as string,
    tutorId: data.tutor_id as string,
    studentId: (data.student_id as string) ?? '',
    studentName: data.student_name as string,
    subject: data.subject as Attendance['subject'],
    date: data.date as string,
    startTime: (data.start_time as string) ?? null,
    endTime: (data.end_time as string) ?? null,
    hours: data.hours as number,
    status: data.status as Attendance['status'],
  };
}

// ---------- Reports ----------
export const dbReports = {
  async create(rep: Omit<Report, 'id' | 'createdAt'>): Promise<Report> {
    const { data, error } = await supabase
      .from('reports')
      .insert({
        tutor_id: rep.tutorId,
        tutor_name: rep.tutorName,
        parent_id: rep.parentId,
        student_name: rep.studentName,
        month: rep.month,
        year: rep.year,
        sessions_completed: rep.sessionsCompleted,
        total_sessions: rep.totalSessions,
        average_score: rep.averageScore,
        improvement: rep.improvement,
        recommendations: rep.recommendations,
        earnings: rep.earnings,
        sent_to_parent: rep.sentToParent,
        sent_to_admin: rep.sentToAdmin,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapReport(data);
  },

  async update(id: string, patch: Partial<Report>): Promise<void> {
    const updateData: Record<string, unknown> = {};
    if (patch.sessionsCompleted !== undefined) updateData.sessions_completed = patch.sessionsCompleted;
    if (patch.totalSessions !== undefined) updateData.total_sessions = patch.totalSessions;
    if (patch.averageScore !== undefined) updateData.average_score = patch.averageScore;
    if (patch.improvement !== undefined) updateData.improvement = patch.improvement;
    if (patch.recommendations !== undefined) updateData.recommendations = patch.recommendations;
    if (patch.earnings !== undefined) updateData.earnings = patch.earnings;
    if (patch.sentToParent !== undefined) updateData.sent_to_parent = patch.sentToParent;
    if (patch.sentToAdmin !== undefined) updateData.sent_to_admin = patch.sentToAdmin;
    const { error } = await supabase.from('reports').update(updateData).eq('id', id);
    if (error) throw new Error(error.message);
  },

  async byTutor(tutorId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapReport);
  },

  async byParent(parentId: string): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapReport);
  },

  async all(): Promise<Report[]> {
    const { data, error } = await supabase
      .from('reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    const reports = (data ?? []).map((row: Record<string, unknown>) => mapReport(row));
    if (reports.length > 0) {
      const tutorIds = [...new Set(reports.map((r) => r.tutorId).filter(Boolean))] as string[];
      if (tutorIds.length > 0) {
        const { data: profiles } = await supabase
          .from('tutor_profiles')
          .select('*')
          .in('uid', tutorIds);
        if (profiles) {
          const profileMap: Record<string, TutorProfile> = {};
          profiles.forEach((p: Record<string, unknown>) => { profileMap[p.uid as string] = mapTutorProfile(p); });
          reports.forEach((r) => { r.tutorProfile = profileMap[r.tutorId]; });
        }
      }
    }
    return reports;
  },
};

function mapReport(data: Record<string, unknown>): Report {
  return {
    id: data.id as string,
    tutorId: data.tutor_id as string,
    tutorName: data.tutor_name as string,
    parentId: data.parent_id as string,
    studentName: data.student_name as string,
    month: (data.month as number) ?? 0,
    year: (data.year as number) ?? 0,
    sessionsCompleted: data.sessions_completed as number,
    totalSessions: data.total_sessions as number,
    averageScore: data.average_score as number,
    improvement: data.improvement as number,
    recommendations: data.recommendations as string,
    earnings: data.earnings as number,
    sentToParent: data.sent_to_parent as boolean,
    sentToAdmin: data.sent_to_admin as boolean,
    createdAt: data.created_at as number,
  };
}

// ---------- Parent Reports ----------
export const dbParentReports = {
  async create(rep: Omit<ParentReport, 'id' | 'createdAt'>): Promise<ParentReport> {
    const { data, error } = await supabase
      .from('parent_reports')
      .insert({
        parent_id: rep.parentId,
        tutor_name: rep.tutorName,
        tutee_name: rep.tuteeName,
        report: rep.report,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapParentReport(data);
  },

  async byParent(parentId: string): Promise<ParentReport[]> {
    const { data, error } = await supabase
      .from('parent_reports')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapParentReport);
  },

  async byTutorName(tutorName: string): Promise<ParentReport[]> {
    const { data, error } = await supabase
      .from('parent_reports')
      .select('*')
      .eq('tutor_name', tutorName)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapParentReport);
  },

  async all(): Promise<ParentReport[]> {
    const { data, error } = await supabase
      .from('parent_reports')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapParentReport);
  },
};

function mapParentReport(data: Record<string, unknown>): ParentReport {
  return {
    id: data.id as string,
    parentId: data.parent_id as string,
    tutorName: data.tutor_name as string,
    tuteeName: data.tutee_name as string,
    report: data.report as string,
    createdAt: data.created_at as number,
  };
}

// ---------- Ratings ----------
export const dbRatings = {
  async create(rating: Omit<Rating, 'id' | 'createdAt'>): Promise<Rating> {
    const { data, error } = await supabase
      .from('ratings')
      .insert({
        tutor_id: rating.tutorId,
        tutor_name: rating.tutorName,
        parent_id: rating.parentId,
        rating: rating.rating,
        comment: rating.comment,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapRating(data);
  },

  async byTutor(tutorId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRating);
  },

  async byTutorName(tutorName: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('tutor_name', tutorName)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRating);
  },

  async byParent(parentId: string): Promise<Rating[]> {
    const { data, error } = await supabase
      .from('ratings')
      .select('*')
      .eq('parent_id', parentId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapRating);
  },
};

function mapRating(data: Record<string, unknown>): Rating {
  return {
    id: data.id as string,
    tutorId: (data.tutor_id as string | null) ?? null,
    tutorName: data.tutor_name as string,
    parentId: data.parent_id as string,
    rating: data.rating as number,
    comment: data.comment as string,
    createdAt: data.created_at as number,
  };
}

// ---------- Tutor Attendance (4-week grid) ----------
export const dbTutorAttendance = {
  async create(rec: Omit<TutorAttendance, 'id' | 'submittedAt'>): Promise<TutorAttendance> {
    const { data, error } = await supabase
      .from('tutor_attendance')
      .insert({
        tutor_id: rec.tutorId,
        job_id: rec.jobId,
        student_name: rec.studentName,
        weeks: rec.weeks,
      })
      .select('*')
      .single();
    if (error) throw new Error(error.message);
    return mapTutorAttendance(data);
  },

  async byTutor(tutorId: string): Promise<TutorAttendance[]> {
    const { data, error } = await supabase
      .from('tutor_attendance')
      .select('*')
      .eq('tutor_id', tutorId)
      .order('submitted_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map(mapTutorAttendance);
  },
};

function mapTutorAttendance(data: Record<string, unknown>): TutorAttendance {
  return {
    id: data.id as string,
    tutorId: data.tutor_id as string,
    jobId: data.job_id as string,
    studentName: data.student_name as string,
    weeks: data.weeks as boolean[][],
    submittedAt: data.submitted_at as number,
  };
}

// ---------- Storage (profile photos) ----------
export const dbProfiles = {
  async get(uid: string): Promise<BaseUser | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', uid)
      .maybeSingle();
    if (error || !data) return null;
    return {
      uid: data.id,
      role: data.role,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      profilePhoto: data.profile_photo,
      createdAt: data.created_at,
    };
  },

  async all(): Promise<BaseUser[]> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return (data ?? []).map((d: Record<string, unknown>) => ({
      uid: d.id as string,
      role: d.role as Role,
      fullName: d.full_name as string,
      email: d.email as string,
      phone: d.phone as string,
      profilePhoto: (d.profile_photo as string) ?? '',
      createdAt: d.created_at as number,
    }));
  },
};

export const dbStorage = {
  async uploadProfilePhoto(uid: string, fileUri: string): Promise<string | null> {
    const ext = fileUri.split('.').pop()?.toLowerCase() ?? 'jpg';
    const path = `${uid}/photo.${ext}`;
    const { error } = await supabase.storage
      .from('profile-photos')
      .upload(path, { uri: fileUri } as unknown as Blob, {
        cacheControl: '3600',
        upsert: true,
      });
    if (error) throw new Error(error.message);
    const { data } = supabase.storage.from('profile-photos').getPublicUrl(path);
    return data.publicUrl;
  },
};

// ---------- Demo seed (no-op with real backend) ----------
export async function seedDemoJobs(): Promise<void> {
  // No longer needed with real backend - parents create real jobs
}

export type Role = 'tutor' | 'parent' | 'admin';

export type Gender = 'Male' | 'Female';

export type TeachingMode = 'Online' | 'In-person' | 'Both';

export type JobStatus = 'open' | 'in_progress' | 'filled';
export type ApplicationStatus = 'pending' | 'accepted' | 'rejected';
export type AttendanceStatus = 'completed' | 'in_progress' | 'missed';
export type RequestStatus = 'open' | 'matched' | 'completed';

export const SUBJECTS = [
  'Math',
  'English',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'Geography',
  'ICT',
  'Economics',
  'Amharic',
] as const;
export type Subject = (typeof SUBJECTS)[number];

export const GRADE_LEVELS = [
  'Grade 7',
  'Grade 8',
  'Grade 9',
  'Grade 10',
  'Grade 11',
  'Grade 12',
  'University',
  'Adult',
] as const;
export type GradeLevel = (typeof GRADE_LEVELS)[number];

export const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const;
export type Day = (typeof DAYS)[number];

export const TIME_SLOTS = ['Morning', 'Afternoon', 'Evening'] as const;
export type TimeSlot = (typeof TIME_SLOTS)[number];

export const LANGUAGES = ['Amharic', 'English', 'Afan Oromo', 'Tigrigna', 'Other'] as const;
export type Language = (typeof LANGUAGES)[number];

export interface BaseUser {
  uid: string;
  role: Role;
  fullName: string;
  email: string;
  phone: string;
  profilePhoto: string | null;
  createdAt: number;
}

export interface PersonalInfo {
  fullName: string;
  dateOfBirth: string;
  gender: Gender | null;
  address: string;
  phone: string;
  profilePhoto: string | null;
}

export interface EducationInfo {
  highestDegree: string;
  fieldOfStudy: string;
  university: string;
  graduationYear: string;
  cgpa: string;
  teachingLicense: string | null;
  cv: string | null;
}

export interface ExperienceInfo {
  yearsOfExperience: string;
  currentPosition: string;
  subjects: Subject[];
  gradeLevels: GradeLevel[];
  teachingMode: TeachingMode | null;
}

export type AvailabilityGrid = Record<Day, Record<TimeSlot, boolean>>;

export interface TutorProfile {
  uid: string;
  personalInfo: PersonalInfo;
  education: EducationInfo;
  experience: ExperienceInfo;
  availability: AvailabilityGrid;
  languages: Language[];
  videoUrl: string | null;
  isProfileComplete: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface ChildInfo {
  name: string;
  grade: GradeLevel;
  subject: Subject;
}

export interface ParentProfile {
  uid: string;
  children: ChildInfo[];
  createdAt: number;
  updatedAt: number;
}

export interface Job {
  id: string;
  title: string;
  childName: string;
  subject: Subject;
  grade: GradeLevel;
  location: string;
  fee: number;
  schedule: string;
  preferences: string;
  status: JobStatus;
  parentId: string;
  parentName: string;
  assignedTutorId: string | null;
  createdAt: number;
}

export interface Application {
  id: string;
  jobId: string;
  tutorId: string;
  tutorName: string;
  parentId: string;
  status: ApplicationStatus;
  appliedAt: number;
  job?: Job;
}

export interface Attendance {
  id: string;
  tutorId: string;
  studentId: string;
  studentName: string;
  subject: Subject;
  date: string;
  startTime: string | null;
  endTime: string | null;
  hours: number;
  status: AttendanceStatus;
}

export interface Report {
  id: string;
  tutorId: string;
  tutorName: string;
  parentId: string;
  studentName: string;
  month: number;
  year: number;
  sessionsCompleted: number;
  totalSessions: number;
  averageScore: number;
  improvement: number;
  recommendations: string;
  earnings: number;
  sentToParent: boolean;
  sentToAdmin: boolean;
  createdAt: number;
  tutorProfile?: TutorProfile;
}

export interface ParentReport {
  id: string;
  parentId: string;
  tutorName: string;
  tuteeName: string;
  report: string;
  createdAt: number;
}

export interface TutorAttendance {
  id: string;
  tutorId: string;
  jobId: string;
  studentName: string;
  weeks: boolean[][];
  submittedAt: number;
}

export interface Rating {
  id: string;
  tutorId: string | null;
  tutorName: string;
  parentId: string;
  rating: number;
  comment: string;
  createdAt: number;
}

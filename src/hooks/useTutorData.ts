import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/src/context/AuthContext';
import { localTutors, localApplications, localAttendance, localJobs } from '@/src/services/backend';
import type { Application, Attendance, Job, TutorProfile } from '@/src/types';

// Definisi tipe data user yang tersimpan di Firestore
export interface UserProfile {
    uid?: string;
    name: string;
    email: string;
    university: string;
    segment: 'muhammadiyah' | 'general';
    role: 'student' | 'admin';
    preferences?: {
      showIslamicInsight: boolean;
      showPrayerTimes: boolean;
    };
    createdAt?: any;
  }
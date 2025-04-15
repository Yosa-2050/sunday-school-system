import type {
  About,
  Education,
  Experience,
  PersonalInfo,
  Skill,
} from "../lib/types";

export type JobSeeker = {
  id: string;
  isActive: boolean;
  bio: About;
  cv: string;
  coverLetter: string;
  experiance: Experience[];
  educationalHistory: Education[];
  skills: Skill[];
  profile: PersonalInfo;
};

export interface Profile {
  id: string;
  firstName: string;
  middleName: string;
  lastName: string;
  mothersFullName: string;
  birthDate: string;
  dobGregorian: string;
  gender: string;
  marriageStatus: string;
  title: string;
  phoneNumber: string;
  profile_picture_id: string;
}

import { CreateInstitutionDTO, RegisterUserRequest } from '@/api/SwaggerApi'

export type InstitutionType = CreateInstitutionDTO['institutionType'];
export type InstitutionRule = 'ROLE_TEST_SITE' | 'ROLE_LABORATORY' | 'ROLE_DOCTORS_OFFICE' | 'ROLE_CLINIC' | 'ROLE_GOVERNMENT_AGENCY'
export type UserRole = Exclude<RegisterUserRequest['userRole'], undefined>;
export type PatientStatus = 'REGISTERED'
  | 'SUSPECTED'
  | 'SCHEDULED_FOR_TESTING'
  | 'TEST_SUBMITTED_IN_PROGRESS'
  | 'TEST_FINISHED_POSITIVE'
  | 'TEST_FINISHED_NEGATIVE'
  | 'TEST_FINISHED_INVALID'
  | 'TEST_FINISHED_RECOVERED'
  | 'TEST_FINISHED_NOT_RECOVERED'
  | 'PATIENT_DEAD'
  | 'DOCTORS_VISIT';

export interface CheckboxOption {
  label: string;
  value: string;
}

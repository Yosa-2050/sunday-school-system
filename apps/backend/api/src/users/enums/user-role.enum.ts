export enum UserRoleType {
  SECURITY_PERSON = "SECURITY_PERSON",
  ADMINISTRATOR = "ADMINISTRATOR"
}
export function validateEmployeeRole(value: string): boolean {
  const validEmployee: string[] = [UserRoleType.SECURITY_PERSON];
  return validEmployee.includes(value);
}

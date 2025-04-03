import { fetcher } from "@shega/shared";

/**
 * 
 * @param enumType 
 * @returns 
 * LoginBy,
    UserRoleType,
    Gender,
    MarriageStatus,
    Title,
    EducationalRequirmentType,
    EmployeeType,
    EmploymentType,
    SalaryFrequencyType,
    SalaryType,
    WorkPlaceType,

 */

type EnumType =
  | "LoginBy"
  | "UserRoleType"
  | "Gender"
  | "MarriageStatus"
  | "Title"
  | "EducationalRequirmentType"
  | "EmployeeType"
  | "EmploymentType"
  | "SalaryFrequencyType"
  | "SalaryType"
  | "WorkPlaceType";

export const fetchEnum = async (
  enumType: EnumType
): Promise<{ data: Record<string, string> }> => {
  if (!enumType) {
    throw new Error("Enum type cannot be empty");
  }
  const response = await fetcher(`/enums/${enumType}`, {
    method: "GET",
    headers: { accept: "*/*" },
  });
  return response as { data: Record<string, string> };
};

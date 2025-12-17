import { BadRequestException } from '@nestjs/common';

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CurrentUser {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getActiveYears(req: any, validate = true): string[] {
        const calendarYears = req?.user?.details?.calendarYears;
        if (!calendarYears) {
            if (validate) {
                throw new BadRequestException(
                    'Unable to find active calendar year id',
                );
            }
            return null;
        }
        return calendarYears;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getActiveYear(req: any, validate = true): string {
        const calendarYears = req?.user?.details?.calendarYears;
        if (!calendarYears) {
            if (validate) {
                throw new BadRequestException(
                    'Unable to find active calendar year id',
                );
            }
            return null;
        }
        return calendarYears;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getProgramId(req: any, validate = true): string {
        const programId = req?.user?.details?.programId;
        if (!programId) {
            if (validate) {
                throw new BadRequestException('Unable to find program id');
            }
            return null;
        }
        return programId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getPrograms(req: any, validate = true): string[] {
        const programId = req?.user?.details?.programs;
        if (!programId) {
            if (validate) {
                throw new BadRequestException('Unable to find program id');
            }
            return null;
        }
        return programId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getMentorId(req: any, validate = true): string {
        const mentorId = req?.user?.details?.mentorId;
        if (!mentorId) {
            if (validate) {
                throw new BadRequestException('Unable to find mentor id');
            }
            return null;
        }
        return mentorId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getRole(req: any): string {
        return req?.user?.role;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getEmployeeOrgId(req: any): string {
        const employeeOrgId = req?.user?.details?.employeeOrgId;
        if (!employeeOrgId) {
            throw new BadRequestException(
                'Unable to find employee organization id',
            );
        }
        return employeeOrgId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getOrganizationId(req: any, validate = true): string {
        const organizationId = req?.user?.details?.organizationId;
        if (!organizationId) {
            if (validate) {
                throw new BadRequestException(
                    'Unable to find linked organization id',
                );
            }
            return null;
        }
        return organizationId;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getApplicantId(req: any): string {
        const organizationId = req?.user?.details?.applicantId;
        if (!organizationId) {
            throw new BadRequestException('No jobs applied');
        }
        return organizationId;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getProfileId(req: any): string {
        const profileId = req?.user?.details?.profileId;
        if (!profileId) {
            throw new BadRequestException('Unable to find linked profile id');
        }
        return profileId;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getReportedById(user: any) {
        return user?.details?.assignedEmployeeId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getSecurityPersonDetails(user: any) {
        return user.myInfo;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getUserId(req: any): string {
        const userId = req?.user?.userId;
        if (!userId) {
            throw new BadRequestException('Unable to find userId');
        }
        return userId;
    }

    // static getMyStudentRegisteredId(user: any) {
    //   constclassId = user?.myInfo?.studentInfo?.registeredClassId;
    //   if (!IsUUID(classId)) {
    //     throw new BadRequestException(
    //       "Student class not found, please contact your administrator"
    //     );
    //   }
    //   return classId;
    // }
}

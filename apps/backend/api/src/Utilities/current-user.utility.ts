import { BadRequestException } from '@nestjs/common';

export class CurrentUser {
    static getClasses(req: any, validate = true) {
        const classes = req?.user?.details?.classes;
        if (!classes) {
            if (validate) {
                throw new BadRequestException('Unable to classes');
            }
            return null;
        }
        return classes;
    }
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
    static getRole(req: any): string {
        return req?.user?.role;
    }
    static getEmployeeOrgId(req: any): string {
        const employeeOrgId = req?.user?.details?.employeeOrgId;
        if (!employeeOrgId) {
            throw new BadRequestException(
                'Unable to find employee organization id',
            );
        }
        return employeeOrgId;
    }
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

    static getApplicantId(req: any): string {
        const organizationId = req?.user?.details?.applicantId;
        if (!organizationId) {
            throw new BadRequestException('No jobs applied');
        }
        return organizationId;
    }

    static getProfileId(req: any): string {
        const profileId = req?.user?.details?.profileId;
        if (!profileId) {
            throw new BadRequestException('Unable to find linked profile id');
        }
        return profileId;
    }

    static getReportedById(user: any) {
        return user?.details?.assignedEmployeeId;
    }
    static getSecurityPersonDetails(user: any) {
        return user.myInfo;
    }

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

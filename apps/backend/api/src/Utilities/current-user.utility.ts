import { BadRequestException } from "@nestjs/common";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class CurrentUser {
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getEmployeeOrgId(req: any): string {
        
                const employeeOrgId = req?.user?.details?.employeeOrgId;
                if (!employeeOrgId) {
                    throw new BadRequestException(
                        'Unable to find employee organiazation id',
                    );
                }
                return employeeOrgId;
    }
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getOrganizationId(req: any): string {
        const organizationId = req?.user?.details?.organizationId;
        if (!organizationId) {
            throw new BadRequestException(
                'Unable to find linked organiazation id',
            );
        }
        return organizationId;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getApplicantnId(req: any): string {
        const organizationId = req?.user?.details?.applicantId;
        if (!organizationId) {
            throw new BadRequestException(
                'Unable to find linked applicant id',
            );
        }
        return organizationId;
    }

    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    static getProfileId(req: any): string {
        const profileId = req?.user?.details?.profileId;
        if (!profileId) {
            throw new BadRequestException(
                'Unable to find linked profile id',
            );
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

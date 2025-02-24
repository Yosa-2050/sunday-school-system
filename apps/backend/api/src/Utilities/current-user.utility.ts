import { BadRequestException } from "@nestjs/common";
import { IsUUID } from "class-validator";

export class CurrentUser {
  static getEmployeeId(user: any): string {
    return user?.details?.employeeId;
  }
  static getOrganizationId(user: any): string {
    return user?.details?.organizationId;
  }
  static getReportedById(user: any) {
    return user?.details?.assignedEmployeeId;
  }
  static getSecurityPersonDetails(user: any) {
      return user.myInfo;
  }
  static getBranchId(user: any): string {
    return user?.details?.branchId;
  }

  // static getMyStudentRegisteredId(user: any) {
  //   var classId = user?.myInfo?.studentInfo?.registeredClassId;
  //   if (!IsUUID(classId)) {
  //     throw new BadRequestException(
  //       "Student class not found, please contact your administrator"
  //     );
  //   }
  //   return classId;
  // }
}

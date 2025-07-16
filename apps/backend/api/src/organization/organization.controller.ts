import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    ParseUUIDPipe,
    Patch,
    Post,
    Put,
    Request,
    Res,
} from '@nestjs/common';
import { CurrentUser } from '@shega/Utilities/current-user.utility';
import { ApprovalType } from '@shega/Utilities/enums/approval-type.enum';
// biome-ignore lint/style/useImportType: <explanation>
import {
    ExportWithQueryRequestModel,
    StringRequestModel,
} from '@shega/Utilities/models/list-string.model';
import { UtilityServices } from '@shega/Utilities/service/utility.services';
import { Roles } from '@shega/auth/decorators/roles.decorator';
// biome-ignore lint/style/useImportType: <explanation>
// biome-ignore lint/style/useImportType: <explanation>
import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { LocationModel } from '@shega/location/dto/model/location.model';
// biome-ignore lint/style/useImportType: <explanation>
import { ContactDetailsRequest } from '@shega/location/dto/request/contact-detail.request.dto';
import { AllEnums } from '@shega/users/enums/allEnums';
import { UserRoleType } from '@shega/users/enums/user-role.enum';
// import { DocumentService } from '@shega/document/document.service';
// biome-ignore lint/style/useImportType: <explanation>
import { Response } from 'express';
// biome-ignore lint/style/useImportType: <explanation>
import { AddOrganizationBranchDto } from './dto/request/add-branch.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { AssignEmployeeRequestDto } from './dto/request/assign-security-person.request.dto';
// biome-ignore lint/style/useImportType: <explanation>
import {
    CreateOrgEmployeeWithContactDto,
    CreateOrganizationEmployeeWithOrgDto,
} from './dto/request/create-employee.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { CreateOrganizationDto } from './dto/request/create-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { UpdateOrganizationInfoDto } from './dto/request/update-organization.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { GetOrganizationListResponseDto } from './dto/response/get-organization.response.dto';
// biome-ignore lint/style/useImportType: <explanation>
import { OrganizationService } from './organization.service';

@Controller('organization')
export class OrganizationController {
    constructor(
        private readonly organizationService: OrganizationService,
        private documentService: DocumentService,
    ) {}

    @Post('createEmployee')
    createEmployee(@Body() dto: CreateOrganizationEmployeeWithOrgDto) {
        return this.organizationService.CreateEmployeeQDE(dto);
    }

    @Patch('submit')
    submitForApproval(@Request() req) {
        return this.organizationService.organizationApproval(
            CurrentUser.getOrganizationId(req),
            ApprovalType.Waiting_Approval,
        );
    }

    @Get('canSubmit')
    canSubmit(@Request() req) {
        return this.organizationService.CheckOrgCanBeSubmitted(
            CurrentUser.getOrganizationId(req),
        );
    }

    @Roles(UserRoleType.SuperAdmin)
    @Patch('approve/:id')
    approveOrganization(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.organizationService.organizationApproval(
            id,
            ApprovalType.Approved,
        );
    }

    @Roles(UserRoleType.SuperAdmin)
    @Patch('decline/:id')
    declineOrganization(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.organizationService.organizationApproval(
            id,
            ApprovalType.Declined,
            dto?.note,
        );
    }

    @Roles(UserRoleType.SuperAdmin)
    @Patch('return/:id')
    returnOrganization(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.organizationService.organizationApproval(
            id,
            ApprovalType.Returned,
            dto?.note,
        );
    }

    @Post()
    create(@Body() createOrganizationDto: CreateOrganizationDto) {
        return this.organizationService.create(createOrganizationDto);
    }

    @Post('/addBranch/:organizationId')
    addBranch(
        @Param('organizationId') id: string,
        @Body() request: AddOrganizationBranchDto,
    ) {
        return this.organizationService.addBranch(request, id);
    }

    @Post('/assignEmployee')
    assignEmployee(@Body() request: AssignEmployeeRequestDto) {
        return this.organizationService.assignEmployee(request);
    }

    @Post('/all')
    findAll(@Body() dto: { q: string }) {
        return this.organizationService.findAllPaginated(dto.q);
    }

    @Post('/export')
    async export(@Body() dto: { q: string }, @Res() res: Response) {
        const org = await this.organizationService.findAllPaginated(dto.q);

        this.documentService.generateCsv(org.data, res, 'organizationList');
    }

    @Post('/exportSelected')
    async exportSelected(
        @Res() res: Response,
        @Body() dto: ExportWithQueryRequestModel,
    ) {
        let data: GetOrganizationListResponseDto[] = [];
        if (dto.list?.length > 0) {
            data = await this.organizationService.getList(dto.list);
        } else {
            data = (
                await this.organizationService.findAllPaginated(dto.q, true)
            ).data;
        }

        this.documentService.generateCsv(data, res, 'organizationList');
    }

    @Get('/listEmployee/:organizationId')
    findAllEmployee(@Param('organizationId') id: string) {
        return this.organizationService.findEmployee(id);
    }

    @Get('/listBranches/:organizationId')
    findAllBranches(@Param('organizationId') id: string) {
        return this.organizationService.findBranches(id);
    }

    @Get('documentToUpload')
    GetDocumentsToUpload() {
        const enumType = 'DocumentType';
        const selectedEnum = AllEnums[enumType];

        if (!selectedEnum) {
            // Handle the case where the specified enum type is not found
            return { error: 'Enum type not found' };
        }
        return UtilityServices.SuccessDataResponse(selectedEnum);
    }

    @Get(':id')
    findOne(@Param('id', new ParseUUIDPipe()) id: string) {
        return this.organizationService.findOne(id);
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch('companyDetail/:id')
    updateOrganization(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
        @Body() dto: UpdateOrganizationInfoDto,
    ) {
        return this.organizationService.updateOrganization(
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch('contacts/:id')
    updateContactDetails(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
        @Body() dto: ContactDetailsRequest,
    ) {
        return this.organizationService.updateOrganizationContactDetails(
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Patch('location/:id')
    updateLocation(
        @Param('id', new ParseUUIDPipe()) id: string,
        @Request() req,
        @Body() dto: LocationModel,
    ) {
        return this.organizationService.updateOrganizationLocation(
            CurrentUser.getOrganizationId(req),
            [dto],
        );
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.organizationService.remove(+id);
    }

    @Roles(UserRoleType.SuperAdmin)
    @Put('activate/:orgId/:isIncludeEmployees')
    activateOrganization(
        @Param('orgId') orgId: string,
        @Param('isIncludeEmployees') isIncludeEmployees: string,
    ) {
        return this.organizationService.setOrgActivationStatus(
            orgId,
            true,
            true,
            isIncludeEmployees,
            '',
        );
    }

    @Roles(UserRoleType.SuperAdmin)
    @Put('deactivate/:orgId/:isIncludeEmployees')
    deactivateOrganization(
        @Param('orgId') orgId: string,
        @Param('isIncludeEmployees') isIncludeEmployees: string,
        @Body() dto: StringRequestModel,
    ) {
        return this.organizationService.setOrgActivationStatus(
            orgId,
            false,
            false,
            isIncludeEmployees,
            dto.note,
        );
    }

    @Roles(UserRoleType.WorkProvider)
    @Post('contactPerson')
    addContactPerson(
        @Request() req,
        @Body() dto: CreateOrgEmployeeWithContactDto,
    ) {
        return this.organizationService.addContactPerson(
            CurrentUser.getOrganizationId(req),
            dto,
        );
    }
}

// biome-ignore lint/style/useImportType: <explanation>
import { Organization } from '@shega/organization/entities/organization.entity';

export class GetOrganizationListResponseDto {
    name: string;
    isActive: boolean;
    createdBy: string;
    createdDate: string;
    id: string;

    constructor(org: Organization) {
        this.createdBy = org.createdBy;
        this.createdDate = org.createdAt?.toISOString();
        this.isActive = org.isActive;
        this.name = org.name;
        this.id = org.id;
    }
}

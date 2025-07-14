// biome-ignore lint/style/useImportType: <explanation>
import { UserDetails } from './response/user-response-payload.response.dto';

export class AuthLoginDto {
    userId: string;
    role: string;
    details: UserDetails;
}

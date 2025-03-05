// biome-ignore lint/style/useImportType: <explanation>
import { UserDetails } from "./response/user-response-payload.reponse.dto";

export class AuthLoginDto {
    sub: string;
    role: string;
    details: UserDetails;
}

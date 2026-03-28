import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';
import { ISmsService } from '../sms-service.interface';

@Injectable()
export class AfroImpl implements ISmsService {
    private readonly logger = new Logger(AfroImpl.name);
    private apiKey: string;
    private baseUrl: string;

    constructor(private readonly httpService: HttpService) {
        this.apiKey =
            'eyJhbGciOiJIUzI1NiJ9.eyJpZGVudGlmaWVyIjoiY0VPVkhQQTk3ajFia1FKZ09QWWMwaVM1Q2FWNVp5OEoiLCJleHAiOjE5MzIwNDM5NjUsImlhdCI6MTc3NDI3NzU2NSwianRpIjoiY2VmOGYyZjktMTdiNC00NDE1LWE1YmEtZTkxNWZlZmJlMTAzIn0.9S6F3QIowEhXRc0gKOvluenZnZ6hGm6rVF0G8Yab2bg';
        this.baseUrl = 'https://api.afromessage.com/api';
    }
    async sendBulkSms(bulk: { to: string; content: string }[]) {
        try {
            const formatted = bulk.map((item) => ({
                to: item.to,
                message: item.content,
            }));
            const payload = {
                sender: 'Tiguhan',
                to: formatted,
                campaign: 'DefaultCampaign',
            };

            this.logger.log(
                `AfroMessage bulk SMS request: ${JSON.stringify(payload)}`,
            );

            const response = await this.httpService.axiosRef.post(
                `${this.baseUrl}/bulk_send`,
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            this.logger.log(
                `AfroMessage bulk SMS response: ${JSON.stringify({
                    status: response.status,
                    data: response.data,
                })}`,
            );
        } catch (error) {
            this.logger.error(
                'AfroMessage bulk SMS request failed',
                error?.stack,
            );
            throw error;
        }
    }

    async sendSms(to: string, content: string): Promise<void> {
        try {
            const response = await this.httpService.axiosRef.post(
                `${this.baseUrl}/send`,
                {
                    to: to,
                    message: content,
                    campaign: 'DefaultCampaign',
                },
                {
                    headers: {
                        Authorization: `Bearer ${this.apiKey}`,
                        'Content-Type': 'application/json',
                    },
                },
            );
            if (response) {
                // console.log('success', response.data);
            }
        } catch (error) {
            // console.log(error);
        }
    }
}

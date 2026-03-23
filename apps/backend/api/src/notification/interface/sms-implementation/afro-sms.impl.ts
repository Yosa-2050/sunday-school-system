// biome-ignore lint/style/useImportType: <explanation>
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
// biome-ignore lint/style/useImportType: <explanation>
import { ISmsService } from '../sms-service.interface';

@Injectable()
export class AfroImpl implements ISmsService {
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

            const response = await this.httpService.axiosRef.post(
                `${this.baseUrl}/bulk_send`,
                {
                    sender: 'Tiguhan',
                    to: formatted,
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
                // console.error('Bulk SMS failed:', response.data);
            }
        } catch (error) {
            // biome-ignore lint/complexity/noUselessCatch: <explanation>
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

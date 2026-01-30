import { SettingsService } from './settings.service';
export declare class SettingsController {
    private readonly settingsService;
    constructor(settingsService: SettingsService);
    getApiKey(): Promise<{
        apiKey: string;
    }>;
    setApiKey(apiKey: string): Promise<{
        success: boolean;
    }>;
}

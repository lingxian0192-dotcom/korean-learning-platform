import { AppService } from './app.service';
export declare class AppController {
    private readonly appService;
    constructor(appService: AppService);
    getHello(): string;
    getHealth(): Promise<{
        status: string;
        error: string;
        database?: undefined;
        userCount?: undefined;
    } | {
        status: string;
        database: string;
        userCount: number;
        error?: undefined;
    }>;
}

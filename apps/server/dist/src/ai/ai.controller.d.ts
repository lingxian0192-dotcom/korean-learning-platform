import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    chat(req: any, body: {
        message: string;
    }): Promise<{
        content: any;
    }>;
}

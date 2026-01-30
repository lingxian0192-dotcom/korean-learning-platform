import { SrsService } from './srs.service';
export declare class SrsController {
    private readonly srsService;
    constructor(srsService: SrsService);
    getDue(req: any): Promise<any[]>;
    review(req: any, body: {
        vocabId: string;
        quality: number;
    }): Promise<any>;
    addToReview(req: any, body: {
        vocabIds: string[];
    }): Promise<any[]>;
}

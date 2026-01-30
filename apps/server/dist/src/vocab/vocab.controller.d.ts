import { VocabService, CreateVocabDto } from './vocab.service';
export declare class VocabController {
    private readonly vocabService;
    constructor(vocabService: VocabService);
    create(req: any, dto: CreateVocabDto): Promise<any>;
    findAll(req: any, query: any): Promise<any[]>;
    findOne(req: any, id: string): Promise<any>;
    update(req: any, id: string, dto: Partial<CreateVocabDto>): Promise<any>;
    remove(req: any, id: string): Promise<{
        success: boolean;
    }>;
}

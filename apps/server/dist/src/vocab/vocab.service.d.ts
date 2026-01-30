import { SupabaseService } from '../supabase/supabase.service';
export interface CreateVocabDto {
    content: string;
    definition?: string;
    type?: 'word' | 'phrase' | 'sentence' | 'pattern';
    tags?: string[];
}
export declare class VocabService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(userId: string, dto: CreateVocabDto): Promise<any>;
    findAll(userId: string, query?: {
        search?: string;
        type?: string;
        tag?: string;
    }): Promise<any[]>;
    findOne(userId: string, id: string): Promise<any>;
    update(userId: string, id: string, dto: Partial<CreateVocabDto>): Promise<any>;
    remove(userId: string, id: string): Promise<{
        success: boolean;
    }>;
}

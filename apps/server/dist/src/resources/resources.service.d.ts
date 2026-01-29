import { SupabaseService } from '../supabase/supabase.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
export declare class ResourcesService {
    private readonly supabaseService;
    constructor(supabaseService: SupabaseService);
    create(createResourceDto: CreateResourceDto, userId: string, token?: string): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(id: string, updateResourceDto: UpdateResourceDto, userId: string, token?: string): Promise<any>;
    remove(id: string, token?: string): Promise<{
        message: string;
    }>;
}

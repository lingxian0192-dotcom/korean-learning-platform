import { ResourcesService } from './resources.service';
import { CreateResourceDto, UpdateResourceDto } from './dto/resource.dto';
export declare class ResourcesController {
    private readonly resourcesService;
    constructor(resourcesService: ResourcesService);
    create(req: any, createResourceDto: CreateResourceDto): Promise<any>;
    findAll(): Promise<any[]>;
    findOne(id: string): Promise<any>;
    update(req: any, id: string, updateResourceDto: UpdateResourceDto): Promise<any>;
    remove(req: any, id: string): Promise<{
        message: string;
    }>;
}

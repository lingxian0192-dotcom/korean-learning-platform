import { InvitationService } from './invitation.service';
export declare class InvitationController {
    private readonly invitationService;
    constructor(invitationService: InvitationService);
    generate(body: {
        count: number;
    }, req: any): Promise<any[]>;
    redeem(body: {
        code: string;
    }, req: any): Promise<{
        success: boolean;
    }>;
    list(): Promise<any[]>;
}

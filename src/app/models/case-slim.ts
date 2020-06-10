
/**
 * Slim read only case model, for viewing cases.
 */
export class CaseSlim {
    id: number;
    deadline: Date;
    region: string;
    subject: string;
    user: string;
}

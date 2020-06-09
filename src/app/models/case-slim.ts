
/**
 * Slim read only case model, for viewing cases.
 */
export class CaseSlim {
    id: number;
    deadline: Date;
    hash: string;
    region: string;
    subject: string;
    user: string;
}

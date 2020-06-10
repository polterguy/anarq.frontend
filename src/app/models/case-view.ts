
/**
 * Slim read only case model, for viewing cases.
 */
export class CaseView {
    created: Date;
    deadline: Date;
    region: string;
    subject: string;
    body: string;
    user: string;
    positive: number;
    negative: number;
    opinion?: boolean;
}


/**
 * Generic model for endpoints only needing to return success or failure of some sort.
 */
export class ResultModel {
    result: string;
    extra?: string;
}

export class ResultAuditModel extends ResultModel {
    case?: number;
    yes?: number;
    no?: number;
    previous?: string;
}

/**
 * Model for regions belonging to user.
 */
export class Region {
    name: string;
    votes: number;
}

/**
 * Model for accepting a case and persisting to backend.
 */
export class UserView {
    username: string;
    status: string;
    cases: number;
    regions: Region[];
    votes: number;
    won?: number;
    lost?: number;
    tied?: number;
    name?: string;
    phone?: string;
    email?: string;
}

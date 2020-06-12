
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
    name: string;
    cases: number;
    regions: Region[];
}

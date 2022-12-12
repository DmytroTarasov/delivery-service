export class User {
    constructor(public _id: string, 
        public email: string, 
        public role: string, 
        public image: string, 
        public created_date: string) {}
}

export interface GetUserProfileResponse {
    user: {
        _id: string;
        role: string;
        email: string;
        image: string;
        created_date: string;
    }
}

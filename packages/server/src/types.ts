export interface User {
   email: string;
   password: string;
   id?: string;
}

export interface Key {
    id: string;
    user_id: string;
    key: string;
}

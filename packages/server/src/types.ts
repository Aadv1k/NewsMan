export interface User {
   email: string;
   password: string;
   id?: string;
}

export interface Key {
    user_id: string;
    key: string;
}

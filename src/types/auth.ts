type User = {
    id: string;
    name: string;
    email: string;
    password: string;
    createdAt: string;
}
type Session = {
    userId: string;
    email: string;
    name: string;
}

export type {
    Session,
    User,
}
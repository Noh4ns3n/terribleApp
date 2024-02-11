type UserT = {
    id?: number;
    username: string;
    password: string;
}

type ProjectT = {
    id?: number;
    name: string;
    description?: string;
    type?: string;
    url?: string;
    language?: string;
}

export type { UserT, ProjectT };
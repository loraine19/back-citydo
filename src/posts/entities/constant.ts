import { $Enums } from "@prisma/client";

export enum PostFilter {
    MINE = 'MINE',
    ILIKE = 'ILIKE',
}


export enum PostSort {
    CREATED_AT = 'CREATED_AT',
    USER = 'USER',
    TITLE = 'TITLE',
    LIKE = 'LIKE',

}

export interface PostFindParams {
    filter?: PostFilter;
    category?: $Enums.PostCategory;
    sort?: PostSort;
    reverse?: boolean;
    search?: string;
}
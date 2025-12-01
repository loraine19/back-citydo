import { UserProvider } from "@prisma/client";

export type AuthUserGoogle = {
    provider: UserProvider;
    providerId: string;
    email: string;
    firstName?: string;
    lastName?: string;
    image?: string;
    userId?: number;
}
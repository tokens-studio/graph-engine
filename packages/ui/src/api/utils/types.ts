import { Session } from "next-auth";

export type Context = {
    session: Session;
    user: string;
}

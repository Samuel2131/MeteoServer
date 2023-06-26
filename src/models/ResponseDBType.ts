
import { User } from "./mongooseSchema";

export type ResponseDB = {
    code: number,
    payload: User | null
}

export type ResponseArrayDB = {
    code: number,
    payload: User[] | null
}
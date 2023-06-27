
import { User } from "./mongooseSchema";

type Message = {
    code: number,
    text?: string
}

export type ResponseDB = {
    message: Message
    payload?: User | null,
}

export type ResponseArrayDB = {
    message: Message
    payload?: User[] | null,
}
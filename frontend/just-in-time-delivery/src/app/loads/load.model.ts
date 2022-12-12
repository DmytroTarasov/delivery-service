import { Message } from "./message.model";

export interface GetLoadsInterface {
    loads: Load[]
}

export interface GetLoadInterface {
    load: Load
}

export interface UpdateLoadInterface {
    name: string;
    payload: string;
    pickup_address: string;
    delivery_address: string;
    dimensions: {
        width: number;
        height: number;
        length: number;
    }
}

export interface GetLoadDetailedInfo {
    load: LoadWithDriverAndMessages
}

export interface Load {
    _id: string;
    created_by: string;
    assigned_to: string;
    status: string;
    state: string;
    name: string;
    payload: string;
    pickup_address: string;
    delivery_address: string;
    dimensions: {
        width: number;
        height: number;
        length: number;
    },
    created_date: string;
}

export interface LoadWithDriverAndMessages {
    _id: string;
    status: string;
    state: string;
    name: string;
    payload: string;
    pickup_address: string;
    delivery_address: string;
    dimensions: {
        width: number;
        height: number;
        length: number;
    },
    created_date: string;
    assigned_to: {
        email: string;
        _id: string;
    },
    created_by: {
        email: string;
        _id: string;
    },
    messages: Message[]
}
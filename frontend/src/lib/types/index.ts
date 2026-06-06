export type * from "./autoreply";
export type * from "./auth";
export type * from "./knowledge";
export type * from "./device";
export type * from "./message";
export type * from "./notification";
export type * from "./product";



export interface StatDashboard {
    autoreply: {
        growth: number;
        total: number;
    }
    knowledge: {
        growth: number;
        total: number;
    }
}

export interface StatUser {
    active: number;
    inactive: number;
    total: number;
}

export interface StatMessage {
    data: number[];
    labels: string[];
}
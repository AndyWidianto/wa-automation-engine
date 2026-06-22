

export type TypeNotification = "INFO" | "SUCCESS" | "WARNING" | "ERROR";
export interface Notification {
    content: string;
    createdAt: string;
    id: string;
    isRead: boolean;
    title: string;
    type: TypeNotification;
    updatedAt: string;
    userId: string;
    user?: {
        id: string;
        name: string;
        email: string;
        profileUrl: string;
    };
    metaJson: Record<string, string>;
}
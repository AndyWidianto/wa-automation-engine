

export interface Autoreply {
    id: string;
    name: string;
    isActive: boolean;
    type: string;
    triggerKeyword: string | null;
    replyContent: string | null;
    aiPrompt: string | null;
    createdAt: Date;
    updatedAt: Date;
}

export interface CreateAutoreply {
    name: string;
    isActive: boolean;
    type: string;
    // triggerKeyword: string | null;
    replyContent: string | null;
    aiPrompt: string | null;
    file: File | null;
}
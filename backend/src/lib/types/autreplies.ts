

export interface CreateAutoreplies {
    name: string;
    isActive: "active" | "inactive";
    type: "keyword" | "ai_rag";
    replyContent?: string;
    aiPrompt?: string;
}

export interface UpdateAutoreplies extends Partial<CreateAutoreplies> {} 
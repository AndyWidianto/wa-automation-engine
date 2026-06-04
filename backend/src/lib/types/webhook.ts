import { 
  WAMessage, 
} from '@whiskeysockets/baileys';

export interface MessageUpsertData {
  key: {
    remoteJid: string;
    fromMe: boolean;
    id: string;
    participant: string;
    addressingMode?: string;
  };
  pushName: string;
  status?: string;
  message: {
    conversation?: string;
    extendedTextMessage?: { text: string };
    caption?: string;
    url?: string;
    mimetype?: string;
    imageMessage?: {
      url: string;
      mimetype: string;
      caption?: string;
    },
    base64: string;
  };
  messageType: string;
}

export interface MessageUpdateData {
  keyId: string;
  remoteJid: string;
  fromMe: boolean;
  status: 'DELIVERY_ACK' | 'READ';
  instanceId: string;
  messageId: string;
}

export interface ConnectionUpdateData {
  state: "open" | "connecting" | "close";
  statusReason: number;
  instance: string;
  wuid?: string;
  profilePictureUrl?: string;
}

// Gabungkan menggunakan OR (|)
export type EvolutionWebhookPayload =
  | { event: "messages.upsert"; data: WAMessage; instance: string; }
  | { event: "messages.update"; data: WAMessage; instance: string; }
  | { event: "connection.update"; data: ConnectionUpdateData; instance: string; };
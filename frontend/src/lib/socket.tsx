import { io, Socket } from "socket.io-client";
import { useAuthStore } from "./store/authStore";
import type { Order } from "./types";



interface UpdateConnection { 
    status: "open" | "close"; 
    instanceName: string;
    phoneNumber: string;
}
interface ServerToClientEvents {
    message: (data: any) => void;
    notification: (msg: string) => void;
    receiver_message: (data: { number: string, message: string, name: string }) => void;
    incoming_order: (data: Order[]) => void;
    update_connection_whatsapp: (data : UpdateConnection) => void;
}

interface ClientToServerEvents {
    send_message: (data: any) => void;
}

const urlWebsocket = import.meta.env.VITE_URL_WEBSOCKET!;
export default function useSocket() {
    const { accessToken } = useAuthStore();
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(urlWebsocket|| "ws://localhost:3000", {
        auth: {
            token: `Bearer ${accessToken}`
        },
        transports: ["websocket"],
        autoConnect: true
    });
    return {
        socket
    }
}


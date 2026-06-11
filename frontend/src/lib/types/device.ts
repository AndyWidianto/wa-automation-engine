
export interface Device {
    number: string | null;
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
    instanceName: string;
    status: "connected" | "disconnected" | "connecting";
    integration: string | null;
}
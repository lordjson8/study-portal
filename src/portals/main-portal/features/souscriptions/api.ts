import {
  type ApiResponse,
  type CreateTicketPayload,
  type Ticket,
} from "@/contracts/api-contracts";
import { apiClient } from "@/services/api.service";
import { delay } from "@/services/mock";

export async function listTickets(): Promise<Ticket[]> {
  const response = await apiClient.get<ApiResponse<Ticket[]>>("/tickets");
  return response.data.data;
}

export async function getTicket(id: string): Promise<Ticket> {
  const response = await apiClient.get<ApiResponse<Ticket>>(`/tickets/${id}`);
  return response.data.data;
}

export async function createTicket(
  payload: CreateTicketPayload,
): Promise<Ticket> {
  try {
    const response = await apiClient.post<ApiResponse<Ticket>>(
      `/ticket`,
      payload,
    );
    return response.data.data;
  } catch {
    const now = new Date().toISOString();
    await delay();
    return {
      id: `tk-${Date.now()}`,
      title: payload.title,
      description: payload.description,
      comments: [],
      status: "OPEN",
      priority: payload.priority,
      createdAt: now,
      updatedAt: now,
      createdBy: "mock",
    };
  }
}

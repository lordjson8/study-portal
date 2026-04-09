import type {
  ApiResponse,
  AppNotification,
  DocumentItem,
  Ticket,
} from "@/contracts/api-contracts";
import { MOCK_TICKETS } from "./mock/tickets.mock";
import { MOCK_DOCUMENTS } from "./mock/documents.mock";
import { MOCK_NOTIFICATIONS } from "./mock/notifications.mock";

interface MockRequest {
  method: string;
  url: string;
}

export type MockResolverResult = ApiResponse<unknown> | null;

function ok<T>(data: T): ApiResponse<T> {
  return { data, success: true };
}

export function mockResolver(req: MockRequest): MockResolverResult {
  const method = req.method.toUpperCase();
  const path = req.url.split("?")[0]?.replace(/^https?:\/\/[^/]+/, "") ?? "";

  if (method === "GET" && path.endsWith("/tickets")) {
    return ok<Ticket[]>(MOCK_TICKETS);
  }

  const ticketDetail = path.match(/\/tickets\/([^/]+)$/);

  // console.log(path,ticketDetail,req.url)

  if (method === "GET" && ticketDetail) {
    const id = ticketDetail[1];
    const found = MOCK_TICKETS.find((t) => t.id === id);
    return found
      ? ok<Ticket>(found)
      : { data: null as never, success: false, message: "Not found" };
  }

  if (method === "GET" && path.endsWith("/documents")) {
    return ok<DocumentItem[]>(MOCK_DOCUMENTS);
  }

  if (method === "GET" && path.endsWith("/notifications")) {
    return ok<AppNotification[]>(MOCK_NOTIFICATIONS);
  }

  return null;
}

import { apiClient } from "@/services/api.service";
import type { ApiResponse, DocumentItem } from "@/contracts/api-contracts";

export async function listDocuments(): Promise<DocumentItem[]> {
  const res = await apiClient.get<ApiResponse<DocumentItem[]>>("/documents");
  return res.data.data;
}

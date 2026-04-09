import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { authService } from "./auth.service";
import { mockResolver } from "./mockResolver";
import { delay } from "./mock";

interface RetriableRequestConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

const baseURL =
  (import.meta.env["VITE_API_BASE_URL"] as string | undefined) ?? "/api";

export const apiClient = axios.create({
  baseURL,
  timeout: 5000,
});

apiClient.interceptors.request.use((config) => {
  const token = authService.getToken();
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const config = error.config as RetriableRequestConfig | undefined;

    if (error.response?.status === 401 && config && !config._retried) {
      config._retried = true;
      try {
        await authService.refresh();
        const token = authService.getToken();
        if (token) {
          config.headers.set("Authorization", `Bearer ${token}`);
        }
        return apiClient.request(config);
      } catch {
        // nothing to catch
      }
    }

    if (!error.response && config) {
      const fake = await fakeResponseFromMock(config);
      console.log("config", fake);
      if (fake) return fake;
    }

    return Promise.reject(error);
  },
);

async function fakeResponseFromMock(
  config: AxiosRequestConfig,
): Promise<AxiosResponse | null> {
  const url = (config.url ?? "").toString();
  const method = (config.method ?? "GET").toString();
  const result = mockResolver({ method, url });
  console.log(result);
  if (!result) return null;
  await delay();
  return {
    data: result,
    status: 200,
    statusText: "OK (mock fallback)",
    headers: {},
    config: config as InternalAxiosRequestConfig,
  };
}

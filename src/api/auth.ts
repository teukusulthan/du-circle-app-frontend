import { api } from "./client";

type RegisterBody = {
  username: string;
  name: string;
  email: string;
  password: string;
};

type RegisterRespRaw = {
  code: number;
  status: string;
  message: string;
  data: {
    user_id: number;
    username: string;
    name: string;
    email: string;
    token: string;
  };
};

type NormalizedAuthResp = {
  token: string;
  user: { id: number; username: string; email: string; full_name?: string };
};

export const authApi = {
  async register(body: RegisterBody): Promise<NormalizedAuthResp> {
    const res = await api.post<RegisterRespRaw>("/auth/register", body);
    const d = res.data.data;
    return {
      token: d.token,
      user: {
        id: d.user_id,
        username: d.username,
        email: d.email,
        full_name: d.name,
      },
    };
  },

  async login(body: {
    identifier: string;
    password: string;
  }): Promise<NormalizedAuthResp> {
    const res = await api.post("/auth/login", body);
    const d = res.data.data ?? res.data;
    return {
      token: d.token,
      user: {
        id: d.user_id,
        username: d.username,
        email: d.email,
        full_name: d.name,
      },
    };
  },
};

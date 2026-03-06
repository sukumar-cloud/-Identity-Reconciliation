import axios from 'axios';
import { IdentifyRequest, IdentifyResponse, Contact } from '../types';

const BASE_URL = 'http://localhost:3000';

const client = axios.create({ baseURL: BASE_URL });

export interface DashboardStats {
  totalContacts: number;
  linkedClusters: number;
  mergeEvents: number;
  recentActivity: {
    email: string | null;
    phone: string | null;
    action: string;
    createdAt: string;
  }[];
}

export const getDashboardStats = async (): Promise<DashboardStats> => {
  const { data } = await client.get<DashboardStats>('/dashboard/stats');
  return data;
};

export const identifyContact = async (req: IdentifyRequest): Promise<IdentifyResponse> => {
  const { data } = await client.post<IdentifyResponse>('/identify', req);
  return data;
};

export const getAllContacts = async (): Promise<Contact[]> => {
  const { data } = await client.get<Contact[]>('/contacts');
  return data;
};

export const searchContacts = async (query: string): Promise<Contact[]> => {
  const { data } = await client.get<Contact[]>(`/contacts/search?q=${encodeURIComponent(query)}`);
  return data;
};

export const deleteContact = async (id: number): Promise<void> => {
  await client.delete(`/contacts/${id}`);
};

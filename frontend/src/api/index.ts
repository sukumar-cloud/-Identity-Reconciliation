import axios from 'axios';
import { IdentifyRequest, IdentifyResponse, Contact } from '../types';

const BASE_URL = import.meta.env.VITE_API_URL || '/api';

const client = axios.create({ baseURL: BASE_URL });

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

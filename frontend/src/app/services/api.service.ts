import { Injectable } from '@angular/core';
import axios from 'axios';

export interface Contact {
  id?: number;
  name: string;
  email: string;
  phone?: string;
  birthdate?: string;
  preferredContactTime?: string;
  createdAt?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = 'http://127.0.0.1:3333/api';

  constructor() {
    // Configurar interceptor de erro global do axios
    axios.interceptors.response.use(
      response => response,
      error => {
        console.error('Erro na API:', error);
        if (error.code === 'ERR_NETWORK') {
          console.error('Verifique se o backend está rodando na porta 3333');
        }
        return Promise.reject(error);
      }
    );
  }

  // Listar contatos
  async getContacts(): Promise<Contact[]> {
    const response = await axios.get<Contact[]>(`${this.baseUrl}/contacts`);
    return response.data;
  }

  // Buscar contato por ID
  async getContact(id: number): Promise<Contact> {
    const response = await axios.get<Contact>(`${this.baseUrl}/contacts/${id}`);
    return response.data;
  }

  // Criar contato
  async createContact(contact: Omit<Contact, 'id' | 'createdAt'>): Promise<Contact> {
    const response = await axios.post<Contact>(`${this.baseUrl}/contacts`, contact);
    return response.data;
  }

  // Atualizar contato
  async updateContact(id: number, contact: Partial<Contact>): Promise<Contact> {
    const response = await axios.put<Contact>(`${this.baseUrl}/contacts/${id}`, contact);
    return response.data;
  }

  // Deletar contato
  async deleteContact(id: number): Promise<Contact> {
    const response = await axios.delete<Contact>(`${this.baseUrl}/contacts/${id}`);
    return response.data;
  }
}


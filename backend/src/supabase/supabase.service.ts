import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
config();
@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      process.env.SUPABASE_URL as string,
      process.env.SUPABASE_ANON_KEY as string,
    );
  }
  async auth() {
    return this.supabase.auth;
  }
  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  }
  async getData(table: string) {
    const { data, error } = await this.supabase.from(table).select();
    if (error) throw error;
    return data;
  }
  async getDataById(table: string, id: string) {
    const { data, error } = await this.supabase
      .from(table)
      .select()
      .eq('id', id);
    if (error) throw error;
    return data;
  }
  async insertData(
    table: string,
    data: any,
  ): Promise<{ data: any; error: any }> {
    const { data: insertedData, error } = await this.supabase
      .from(table)
      .insert(data)
      .select();
    if (error) throw error;
    return { data: insertedData, error };
  }

  async updateData(table: string, data: any, id: string) {
    const { data: updatedData, error } = await this.supabase
      .from(table)
      .update(data)
      .match({ id })
      .select();
    if (error) throw error;
    return { data: updatedData, error };
  }

  async deleteData(table: string, id: string) {
    const { error } = await this.supabase.from(table).delete().match({ id });
    if (error) throw error;
  }
}

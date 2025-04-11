import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { config } from 'dotenv';
import { Request } from 'express';
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
  async getUserFromRequest(req: Request) {
    const accessToken = req.cookies['access_token']; // Get access_token from cookies

    if (!accessToken) {
      throw new Error('Access token is missing in cookies');
    }

    const { data, error } = await this.supabase.auth.getUser(accessToken);
    console.log(data);

    if (error) {
      throw new Error('Failed to get user: ' + error.message);
    }

    return data; // Return user data including the ID
  }
  async signup(username: string, email: string, password: string) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: username,
        },
      },
    });
    if (error) throw error;

    return data;
  }
  async checkUsername(username: string) {
    // List all users
    const { data, error } = await this.supabase.auth.admin.listUsers();

    if (error) throw error;

    const user = data.users.find(
      (user) => user.user_metadata?.full_name === username,
    );
    return user ? true : false;
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

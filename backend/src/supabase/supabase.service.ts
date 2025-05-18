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
  async signInWithOAuth(provider: 'google', redirectTo?: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: redirectTo || process.env.OAUTH_REDIRECT_URL, // e.g., 'http://localhost:3000/auth/callback'
        },
      });

      if (error) throw error;
      return data; // contains the `url` to redirect the user to
    } catch (error) {
      throw error;
    }
  }

  async signIn(email: string, password: string) {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getUserFromRequest(req: Request) {
    try {
      const accessToken = req.cookies['access_token']; // Get access_token from cookies

      if (!accessToken) {
        throw new Error('Access token is missing in cookies');
      }

      const { data, error } = await this.supabase.auth.getUser(accessToken);

      if (error) {
        throw new Error('Failed to get user: ' + error.message);
      }

      return data; // Return user data including the ID
    } catch (error) {
      throw error;
    }
  }
  async signup(username: string, email: string, password: string) {
    try {
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
    } catch (error) {
      throw error;
    }
  }
  async checkUsername(username: string) {
    try {
      // List all users
      const { data, error } = await this.supabase.auth.admin.listUsers();

      if (error) throw error;

      const user = data.users.find(
        (user) => user.user_metadata?.full_name === username,
      );
      return user ? true : false;
    } catch (error) {
      throw error;
    }
  }

  async getData(table: string) {
    try {
      const { data, error } = await this.supabase.from(table).select();
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async getDataById(table: string, id: string) {
    try {
      const { data, error } = await this.supabase
        .from(table)
        .select()
        .eq('id', id);
      if (error) throw error;
      return data;
    } catch (error) {
      throw error;
    }
  }
  async insertData(
    table: string,
    data: any,
  ): Promise<{ data: any; error: any }> {
    try {
      const { data: insertedData, error } = await this.supabase
        .from(table)
        .insert(data)
        .select();
      if (error) throw error;
      return { data: insertedData, error };
    } catch (error) {
      throw error;
    }
  }

  async updateData(
    table: string,
    data: any,
    keyValue: string,
    keyName: string = 'id',
  ) {
    try {
      const { data: updatedData, error } = await this.supabase
        .from(table)
        .update(data)
        .match({ [keyName]: keyValue })
        .select();
      if (error) throw error;
      return { data: updatedData, error };
    } catch (error) {
      throw error;
    }
  }

  async deleteData(table: string, keyValue: string, keyName: string = 'id') {
    try {
      const { error } = await this.supabase
        .from(table)
        .delete()
        .match({ [keyName]: keyValue });
      if (error) throw error;
    } catch (error) {
      throw error;
    }
  }
}

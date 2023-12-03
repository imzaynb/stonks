import { Account } from "@/types/trade";
import { Database } from "../types/supabase";
import { SupabaseClient, createClient } from "@supabase/supabase-js";


export const supabaseClient = async (supabaseAccessToken: string) => {
  const supabase = createClient<Database>(
    (process.env.NEXT_PUBLIC_SUPABASE_URL as string),
    (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string),
    {
      global: { headers: { Authorization: `Bearer ${supabaseAccessToken}` } },
    }
  );

  return supabase;
}

export const getAccount = async (supabase: SupabaseClient<Database>, userId: string): Promise<Account | null> => {
  try {
    const { data, error, status } = await supabase
      .from("accounts")
      .select("*")
      .eq('user_id', userId);

    if (error && status !== 406) {
      throw error;
    }

    const account: Account | null = data ? data[0] : null;
    return account;
  } catch (error) {
    alert(`${error} in getAccount()`);
  }
  return null;
}

export const createAccount = async (supabase: SupabaseClient<Database>, userId: string) => {
  try {
    const { data, error, status } = await supabase
      .from("accounts")
      .insert({ user_id: userId });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      console.log(data);
    }
  } catch (error) {
    alert(`${error} in createAccount()`);
  }
}

export const getTrades = async (supabase: SupabaseClient<Database>, userId: string) => {
  try {
    // When a user is just created, there will not be an account associated with that user. Create that if this is the case.
    const account = await getAccount(supabase, userId);
    const accountId = account?.id;

    const { data, error, status } = await supabase
      .from("trades")
      .select("*")
      .eq("account_id", accountId)
      .order("shares", {
        ascending: false,
      })

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      console.log(data)
      return data;
    }
  } catch (error) {
    alert(`${error} in getTrades()`);
  }
  return null;
}

export const createTrade = async (
  supabase: SupabaseClient<Database>,
  accountId: number,
  ticker: string,
  name: string,
  shares: number,
  price: number) => {
  try {
    const { data, error, status } = await supabase
      .from("trades")
      .insert({ account_id: accountId, symbol: ticker, name: name, price: price, shares: shares });

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      console.log(data);
    }
  } catch (error) {
    alert(`${error} in createTrade()`);
  }
}

export const updateAccount = async (
  supabase: SupabaseClient<Database>,
  userId: string,
  cash: number,
) => {
  try {
    const { data, error, status } = await supabase
      .from("accounts")
      .update({ cash: cash })
      .eq("user_id", userId);

    if (error && status !== 406) {
      throw error;
    }

    if (data) {
      console.log(data);
    }
  } catch (error) {
    alert(`${error} in createAccount()`);
  }

}
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

export const isAccountMade = async (supabase: SupabaseClient<Database>, userId: string): Promise<boolean> => {
    try {
        const { data, error, status } = await supabase
            .from("accounts")
            .select("*")
            .eq('user_id', userId);

        if (error && status !== 406) {
            throw error;
        }

        if (data) {
            if (data.length === 0) {
                return false;
            } else {
                return true;
            }
        }
    } catch (error) {
        alert(`${error} in isAccountMade()`);
    }
    return false;
}

export const createAnAccount = async (supabase: SupabaseClient<Database>, userId: string) => {
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
        alert(`${error} in createAnAccount()`);
    }
}

export const getAccountIdWithUserId = async (supabase: SupabaseClient<Database>, userId: string) => {
    try {
        const { data, error, status } = await supabase.from("accounts").select("id").eq("user_id", userId);

        if (error && status !== 406) {
            throw error;
        }

        if (data) {
            return data[0].id;
        }
    } catch (error) {
        alert(`${error} in getAccountIdWithUserId`)
    }
    return null;
}

export const getTrades = async (supabaseAccessToken: string | undefined | null, userId: string | undefined | null) => {
    try {
        if (!supabaseAccessToken) {
            throw "Error loading supabaseAccessToken";
        } else if (!userId) {
            throw "Error loading userId";
        }

        const supabase = await supabaseClient(supabaseAccessToken);

        // When a user is just created, there will not be an account associated with that user. Create that if this is the case.
        const hasAccount = await isAccountMade(supabase, userId);
        if (!hasAccount) {
            createAnAccount(supabase, userId);
        }

        const accountId = await getAccountIdWithUserId(supabase, userId);

        const { data, error, status } = await supabase
            .from("trades")
            .select("*")
            .eq("account_id", accountId)

        if (error && status !== 406) {
            throw error;
        }

        if (data) {
            console.log(data);
        }
    } catch (error) {
        alert(`${error} in getTrades()`);
    }
    return null;
}
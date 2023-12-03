"use client"

import Link from "next/link"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useEffect, useMemo, useRef, useState } from "react"

import { buyStockFormSchema, getCurrentDateInNY } from "@/lib/utils"
import { useSession, useUser } from "@clerk/nextjs"
import { createTrade, getAccount, supabaseClient, updateAccount } from "@/lib/database"
import { alphaVantageTimeSeriesDaily, createStock, findNameByTicker } from "@/lib/stocks"
import { useRouter } from "next/navigation"


export default function BuyPage() {
  const { user } = useUser();
  const { session } = useSession();
  const router = useRouter();

  const supabaseAccessToken = useRef<string | null>();

  useEffect(() => {
    (async () => {
      supabaseAccessToken.current = await session?.getToken({
        template: "supabase"
      });
    })();
  }, []);

  const form = useForm<z.infer<typeof buyStockFormSchema>>({
    resolver: zodResolver(buyStockFormSchema),
    defaultValues: {
      ticker: "",
      shares: 1
    },
  })

  // 2. Define a submit handler.
  const onSubmit = (values: z.infer<typeof buyStockFormSchema>) => {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.

    const handleSubmit = async () => {
      if (!supabaseAccessToken.current || !user?.id)
        return;

      const supabase = await supabaseClient(supabaseAccessToken.current);

      if (!supabase)
        return;

      const account = await getAccount(supabase, user.id);

      if (!account)
        return;

      const ohlcv = await alphaVantageTimeSeriesDaily(values.ticker, "compact", getCurrentDateInNY());
      if (!ohlcv)
        return;

      const stock = createStock(ohlcv, await findNameByTicker(values.ticker), values.ticker);

      const stockCost = stock.ohlcv.close * values.shares;
      if (account.cash > stockCost) {
        createTrade(supabase, account.id, stock.ticker, stock.name, values.shares, stock.ohlcv.close);
      }

      updateAccount(supabase, user.id, account.cash - stockCost);

      console.log("success");
      router.push("/");
    }

    handleSubmit();
  }

  return (
    <main className="container">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-6 mx-auto w-[min-content]">
          <FormField
            control={form.control}
            name="ticker"
            render={({ field }) => (
              <FormItem className="">
                <FormLabel>Ticker Symbol</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" className="w-50" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div>
            <FormField
              control={form.control}
              name="shares"
              render={({ field }) => (
                <FormItem className="w-[min-content]">
                  <FormLabel>Shares</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" className="w-50" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <Button type="submit" className="">Submit</Button>
          </div>
        </form>
      </Form>
    </main>
  )
}
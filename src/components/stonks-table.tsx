"use client";

import { useSession, useUser } from "@clerk/nextjs";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useEffect, useState } from "react";
import { createAccount, getAccount, getTrades, supabaseClient } from "@/lib/database";
import { Trade } from "@/types/trade";
import { USDollar } from "@/lib/utils";


const StonksTable = () => {
  const { session } = useSession();
  const { user } = useUser();

  const [trades, setTrades] = useState<Trade[] | null>(null);

  useEffect(() => {
    const obtainTrades = async () => {
      const supabaseAccessToken = await session?.getToken({
        template: "supabase",
      });

      if (!supabaseAccessToken || !user?.id)
        return;

      const supabase = await supabaseClient(supabaseAccessToken);

      if (!supabase)
        return;

      let account = await getAccount(supabase, user.id);
      if (!account) {
        createAccount(supabase, user.id);
        account = await getAccount(supabase, user.id);
      }
      const trades = await getTrades(supabase, user.id);

      setTrades(trades);
    }
    obtainTrades();
  }, []);


  return (
    <Table>
      <TableCaption>
        Table Caption here.
      </TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">Symbol</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Shares</TableHead>
          <TableHead>Price</TableHead>
          <TableHead className="text-right">TOTAL</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {trades?.map((trade) => (
          <TableRow key="1">
            <TableCell className="font-medium">{trade.symbol}</TableCell>
            <TableCell>{trade.name}</TableCell>
            <TableCell>{trade.shares}</TableCell>
            <TableCell>{USDollar.format(trade.price)}</TableCell>
            <TableCell className="text-right">{USDollar.format(trade.shares * trade.price)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default StonksTable;
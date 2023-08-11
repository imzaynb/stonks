"use client";

import { useSession, useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
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
import { getTrades } from "@/lib/database";
import { Trade } from "@/types/trade";

const StonksTable = () => {
    const { session } = useSession();
    const { user } = useUser();

    const [trades, setTrades] = useState<Trade[] | null>(null);

    useEffect(() => {
        const obtainTrades = async () => {
            const supabaseAccessToken = await session?.getToken({
                template: "supabase",
            });

            const trades = await getTrades(supabaseAccessToken, user?.id);

            if (trades) {
                setTrades(trades);
            }
        }
        obtainTrades();
    }, []);


    return (
        <Table>
            <TableCaption>Data provided by
                <Button variant="link">
                    <a href="https://iexcloud.io/">IEX</a>
                </Button>.
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
                        <TableCell>{trade.price}</TableCell>
                        <TableCell className="text-right">{trade.shares * trade.price}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

export default StonksTable;
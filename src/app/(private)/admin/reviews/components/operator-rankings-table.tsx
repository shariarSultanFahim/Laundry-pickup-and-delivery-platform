"use client";

import { useEffect, useState } from "react";

import { Star, Trophy } from "lucide-react";

import type { OperatorRanking } from "@/types/review-management";

import { Badge } from "@/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/ui/table";

import { fetchOperatorRankings } from "./reviews-api";

function getRankBadgeColor(rank: number) {
  if (rank === 1) return "bg-yellow-500 hover:bg-yellow-600";
  if (rank === 2) return "bg-gray-400 hover:bg-gray-500";
  if (rank === 3) return "bg-orange-600 hover:bg-orange-700";
  return "bg-blue-600 hover:bg-blue-700";
}

export default function OperatorRankingsTable() {
  const [rankings, setRankings] = useState<OperatorRanking[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function loadRankings() {
      setIsLoading(true);
      const data = await fetchOperatorRankings();
      setRankings(data);
      setIsLoading(false);
    }

    void loadRankings();
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="gap-2 flex items-center">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <CardTitle>Top 10 Operators by Rating</CardTitle>
        </div>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-16">Rank</TableHead>
              <TableHead>Operator</TableHead>
              <TableHead>Avg Rating</TableHead>
              <TableHead className="text-center">Total Reviews</TableHead>
              <TableHead className="text-center">Positive</TableHead>
              <TableHead className="text-center">Negative</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-muted-foreground text-center">
                  Loading rankings...
                </TableCell>
              </TableRow>
            ) : rankings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-muted-foreground text-center">
                  No rankings found.
                </TableCell>
              </TableRow>
            ) : (
              rankings.map((operator) => (
                <TableRow key={operator.operatorId}>
                  <TableCell>
                    <Badge className={getRankBadgeColor(operator.rank)}>#{operator.rank}</Badge>
                  </TableCell>
                  <TableCell className="font-medium">{operator.operatorName}</TableCell>
                  <TableCell>
                    <div className="gap-1 flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-semibold">{operator.averageRating.toFixed(1)}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{operator.totalReviews}</TableCell>
                  <TableCell className="text-center">
                    <span className="text-green-600 font-medium">{operator.positiveReviews}</span>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className="text-red-600 font-medium">{operator.negativeReviews}</span>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

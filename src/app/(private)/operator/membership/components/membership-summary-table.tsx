import type { MembershipBreakdownData } from "@/types/membership-breakdown";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/ui";

interface MembershipSummaryTableProps {
  data: MembershipBreakdownData;
}

function currencyFormatter(amount: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(amount);
}

export default function MembershipSummaryTable({ data }: MembershipSummaryTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Type</TableHead>
              <TableHead className="text-right">Total Orders</TableHead>
              <TableHead className="text-right">Percentage</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Avg Order Value</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.summaryRows.map((row) => (
              <TableRow key={row.orderType}>
                <TableCell>
                  <div className="gap-2 flex items-center">
                    <span className={`h-2.5 w-2.5 rounded-full ${row.colorClassName}`} />
                    <span className="font-medium">{row.orderType}</span>
                  </div>
                </TableCell>
                <TableCell className="text-right">{row.totalOrders}</TableCell>
                <TableCell className="text-right">{row.percentage}%</TableCell>
                <TableCell className="text-right">{currencyFormatter(row.revenue)}</TableCell>
                <TableCell className="text-right">
                  {currencyFormatter(row.averageOrderValue)}
                </TableCell>
              </TableRow>
            ))}

            <TableRow className="font-semibold">
              <TableCell>Total</TableCell>
              <TableCell className="text-right">{data.summaryTotals.totalOrders}</TableCell>
              <TableCell className="text-right">100%</TableCell>
              <TableCell className="text-right">
                {currencyFormatter(data.summaryTotals.totalRevenue)}
              </TableCell>
              <TableCell className="text-right">
                {currencyFormatter(data.summaryTotals.averageOrderValue)}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

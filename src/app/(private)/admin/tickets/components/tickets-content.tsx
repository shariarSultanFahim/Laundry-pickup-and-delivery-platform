import { lazy, Suspense } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/ui/card";

const TicketsTable = lazy(() => import("./tickets-table"));

// function StatsLoadingFallback() {
//   return (
//     <div className="gap-4 md:grid-cols-3 grid">
//       {Array.from({ length: 3 }).map((_, index) => (
//         <Card key={index}>
//           <CardContent>
//             <div className="h-24 text-muted-foreground flex items-center justify-center">
//               Loading stats...
//             </div>
//           </CardContent>
//         </Card>
//       ))}
//     </div>
//   );
// }

function TableLoadingFallback() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Support Tickets</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-24 text-muted-foreground flex items-center justify-center">
          Loading tickets...
        </div>
      </CardContent>
    </Card>
  );
}

export default function TicketsContent() {
  return (
    <div className="space-y-6">
      {/* <Suspense fallback={<StatsLoadingFallback />}>
        <TicketsStatsCards />
      </Suspense> */}

      <Suspense fallback={<TableLoadingFallback />}>
        <TicketsTable />
      </Suspense>
    </div>
  );
}

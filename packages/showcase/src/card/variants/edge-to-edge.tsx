import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@erbium/ui/components/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@erbium/ui/components/table";

const expenses = [
  { amount: "$24.00", date: "Jun 12", merchant: "Figma" },
  { amount: "$20.00", date: "Jun 10", merchant: "Vercel" },
  { amount: "$18.00", date: "Jun 4", merchant: "GitHub" },
];

export default function CardEdgeToEdgeExample() {
  return (
    <Card className="w-96 max-w-full gap-0">
      <CardHeader>
        <CardTitle>Workspace expenses</CardTitle>
        <CardDescription>June 2026 · 3 transactions</CardDescription>
      </CardHeader>
      <Table
        aria-label="June workspace expenses"
        containerProps={{ className: "mt-(--card-spacing)" }}
      >
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="ps-(--card-spacing)" scope="col">
              Merchant
            </TableHead>
            <TableHead scope="col">Date</TableHead>
            <TableHead className="pe-(--card-spacing) text-end" scope="col">
              Amount
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map(({ amount, date, merchant }) => (
            <TableRow key={merchant}>
              <TableCell className="ps-(--card-spacing) font-medium">{merchant}</TableCell>
              <TableCell className="text-muted-foreground">{date}</TableCell>
              <TableCell className="pe-(--card-spacing) text-end tabular-nums">{amount}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <CardFooter className="justify-between font-medium">
        <span>Monthly total</span>
        <span className="tabular-nums">$62.00</span>
      </CardFooter>
    </Card>
  );
}

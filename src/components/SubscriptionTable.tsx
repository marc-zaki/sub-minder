import { useSubscriptions } from "@/context/SubscriptionContext";
import { format, differenceInDays } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Ban, RefreshCw } from "lucide-react";

const SubscriptionTable = () => {
  const { subscriptions, cancelSubscription, renewSubscription, isLoading, isError } = useSubscriptions();
  const now = new Date();

  if (isLoading) return <p className="p-4 text-center">Loading subscriptions...</p>;
  if (isError) return <p className="p-4 text-center text-red-500">Failed to load subscriptions.</p>;

  const sorted = [...subscriptions].sort(
    (a, b) => a.nextDueDate.getTime() - b.nextDueDate.getTime()
  );

  const getDueDateColor = (date: Date, status: string) => {
    if (status === "Cancelled") return "text-muted-foreground";
    const days = differenceInDays(date, now);
    if (days <= 3) return "text-danger";
    if (days <= 7) return "text-warning";
    return "text-foreground";
  };

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 overflow-hidden">
      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              {["Name", "Category", "Cost (EGP)", "Cycle", "Next Due", "Status", "Actions"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {sorted.map((sub) => (
              <tr key={sub.id} className="hover:bg-muted/30 transition-colors">
                <td className="px-5 py-4 font-medium text-foreground">{sub.name}</td>
                <td className="px-5 py-4">
                  <span className="text-sm text-muted-foreground">{sub.category}</span>
                </td>
                <td className="px-5 py-4 font-mono text-sm text-foreground">
                  EGP {sub.cost.toFixed(2)}
                </td>
                <td className="px-5 py-4 text-sm text-muted-foreground">{sub.cycle}</td>
                <td className={`px-5 py-4 text-sm font-medium ${getDueDateColor(sub.nextDueDate, sub.status)}`}>
                  {format(sub.nextDueDate, "MMM d, yyyy")}
                </td>
                <td className="px-5 py-4">
                  <Badge
                    variant={sub.status === "Active" ? "default" : "secondary"}
                    className={
                      sub.status === "Active"
                        ? "bg-success/15 text-success border border-success/30 hover:bg-success/20"
                        : "bg-muted text-muted-foreground border border-border hover:bg-muted"
                    }
                  >
                    {sub.status}
                  </Badge>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    {sub.status === "Active" ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => cancelSubscription(sub.id)}
                        className="text-muted-foreground hover:text-danger hover:bg-danger/10 gap-1 text-xs"
                      >
                        <Ban className="h-3.5 w-3.5" />
                        Cancel
                      </Button>
                    ) : null}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => renewSubscription(sub.id)}
                      className="text-muted-foreground hover:text-primary hover:bg-primary/10 gap-1 text-xs"
                    >
                      <RefreshCw className="h-3.5 w-3.5" />
                      Renew
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden divide-y divide-border/30">
        {sorted.map((sub) => (
          <div key={sub.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">{sub.name}</span>
              <Badge
                variant={sub.status === "Active" ? "default" : "secondary"}
                className={
                  sub.status === "Active"
                    ? "bg-success/15 text-success border border-success/30"
                    : "bg-muted text-muted-foreground border border-border"
                }
              >
                {sub.status}
              </Badge>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{sub.category} · {sub.cycle}</span>
              <span className="font-mono text-foreground">EGP {sub.cost.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-sm font-medium ${getDueDateColor(sub.nextDueDate, sub.status)}`}>
                Due {format(sub.nextDueDate, "MMM d, yyyy")}
              </span>
              <div className="flex gap-1.5">
                {sub.status === "Active" && (
                  <Button variant="ghost" size="sm" onClick={() => cancelSubscription(sub.id)}
                    className="text-muted-foreground hover:text-danger hover:bg-danger/10 text-xs h-8 px-2">
                    <Ban className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => renewSubscription(sub.id)}
                  className="text-muted-foreground hover:text-primary hover:bg-primary/10 text-xs h-8 px-2">
                  <RefreshCw className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SubscriptionTable;

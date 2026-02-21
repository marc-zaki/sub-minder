import { DollarSign, Activity, CalendarClock } from "lucide-react";
import { useSubscriptions } from "@/context/SubscriptionContext";
import { differenceInDays } from "date-fns";

const SummaryCards = () => {
  const { subscriptions } = useSubscriptions();
  const now = new Date();

  const activeSubs = subscriptions.filter((s) => s.status === "Active");

  const totalMonthlySpend = activeSubs.reduce((sum, s) => {
    return sum + (s.cycle === "Monthly" ? s.cost : s.cost / 12);
  }, 0);

  const upcomingRenewals = activeSubs.filter(
    (s) => differenceInDays(s.nextDueDate, now) <= 7 && differenceInDays(s.nextDueDate, now) >= 0
  ).length;

  const cards = [
    {
      title: "Monthly Spend",
      value: `EGP ${totalMonthlySpend.toFixed(2)}`,
      icon: DollarSign,
      accent: "text-primary",
      bg: "bg-primary/5 neon-border border",
    },
    {
      title: "Active Subs",
      value: activeSubs.length.toString(),
      icon: Activity,
      accent: "text-success",
      bg: "bg-success/5 border border-success/20",
    },
    {
      title: "Due in 7 Days",
      value: upcomingRenewals.toString(),
      icon: CalendarClock,
      accent: "text-warning",
      bg: "bg-warning/5 border border-warning/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className={`rounded-xl p-5 card-shine ${card.bg} transition-all hover:scale-[1.02]`}
        >
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{card.title}</span>
            <card.icon className={`h-4.5 w-4.5 ${card.accent}`} />
          </div>
          <p className={`text-2xl font-bold tracking-tight ${card.accent}`}>{card.value}</p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;

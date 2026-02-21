import React, { createContext, useContext, useState, ReactNode } from "react";
import { addMonths, addYears } from "date-fns";

export type BillingCycle = "Monthly" | "Yearly";
export type Category = "Streaming" | "Software" | "Utility" | "Other";
export type SubStatus = "Active" | "Cancelled";

export interface Subscription {
  id: string;
  name: string;
  cost: number;
  cycle: BillingCycle;
  nextDueDate: Date;
  category: Category;
  status: SubStatus;
}

interface SubscriptionContextType {
  subscriptions: Subscription[];
  addSubscription: (sub: Omit<Subscription, "id" | "status">) => void;
  cancelSubscription: (id: string) => void;
  renewSubscription: (id: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

const dummySubscriptions: Subscription[] = [
  {
    id: "1",
    name: "Netflix",
    cost: 15.99,
    cycle: "Monthly",
    nextDueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    category: "Streaming",
    status: "Active",
  },
  {
    id: "2",
    name: "Spotify",
    cost: 9.99,
    cycle: "Monthly",
    nextDueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days
    category: "Streaming",
    status: "Active",
  },
  {
    id: "3",
    name: "Adobe Creative Cloud",
    cost: 599.88,
    cycle: "Yearly",
    nextDueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000), // 45 days
    category: "Software",
    status: "Active",
  },
  {
    id: "4",
    name: "Electric Utility",
    cost: 120.0,
    cycle: "Monthly",
    nextDueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days
    category: "Utility",
    status: "Active",
  },
];

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>(dummySubscriptions);

  const addSubscription = (sub: Omit<Subscription, "id" | "status">) => {
    setSubscriptions((prev) => [
      ...prev,
      { ...sub, id: crypto.randomUUID(), status: "Active" },
    ]);
  };

  const cancelSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: "Cancelled" as SubStatus } : s))
    );
  };

  const renewSubscription = (id: string) => {
    setSubscriptions((prev) =>
      prev.map((s) => {
        if (s.id !== id) return s;
        const nextDate = s.cycle === "Monthly" ? addMonths(s.nextDueDate, 1) : addYears(s.nextDueDate, 1);
        return { ...s, nextDueDate: nextDate, status: "Active" as SubStatus };
      })
    );
  };

  return (
    <SubscriptionContext.Provider value={{ subscriptions, addSubscription, cancelSubscription, renewSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
};

import React, { createContext, useContext, ReactNode } from "react";
import { addMonths, addYears } from "date-fns";
import { useQuery, useQueryClient } from "@tanstack/react-query";

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
  isLoading: boolean;
  isError: boolean;
  addSubscription: (sub: Omit<Subscription, "id" | "status">) => void;
  cancelSubscription: (id: string) => void;
  renewSubscription: (id: string) => void;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);



export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();
  
  // Use full URL in production, relative path in dev (where proxy works)
  const apiBase = "https://sub-minder.onrender.com" || '/api';

  const fetchSubscriptions = async (): Promise<Subscription[]> => {
    try {
      console.log(`Fetching from: ${apiBase}/subscriptions`);
      const res = await fetch(`${apiBase}/subscriptions`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      const data: any[] = await res.json();
      console.log("Fetched subscriptions:", data);
      // convert date strings to Date objects and normalize _id -> id
      return data.map((s) => ({
        id: s._id || s.id,
        name: s.name,
        cost: s.cost,
        cycle: s.cycle,
        nextDueDate: new Date(s.nextDueDate),
        category: s.category,
        status: s.status,
      }));
    } catch (err) {
      console.error("Error fetching subscriptions:", err);
      throw err;
    }
  };

  const {
    data: subscriptions = [],
    isLoading,
    isError,
  } = useQuery<Subscription[]>({
    queryKey: ["subscriptions"],
    queryFn: fetchSubscriptions,
  });

  const addSubscription = async (sub: Omit<Subscription, "id" | "status">) => {
    try {
      console.log("Adding subscription:", sub);
      const res = await fetch(`${apiBase}/subscriptions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sub),
      });
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      }
      console.log("Subscription added successfully");
      queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
    } catch (err) {
      console.error("Error adding subscription:", err);
      throw err;
    }
  };

  const cancelSubscription = async (id: string) => {
    await fetch(`${apiBase}/subscriptions/${id}/cancel`, { method: "PATCH" });
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  const renewSubscription = async (id: string) => {
    await fetch(`${apiBase}/subscriptions/${id}/renew`, { method: "PATCH" });
    queryClient.invalidateQueries({ queryKey: ["subscriptions"] });
  };

  return (
    <SubscriptionContext.Provider
      value={{ subscriptions, isLoading: !!isLoading, isError: !!isError, addSubscription, cancelSubscription, renewSubscription }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscriptions = () => {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) throw new Error("useSubscriptions must be used within SubscriptionProvider");
  return ctx;
};

import { useState } from "react";
import { SubscriptionProvider } from "@/context/SubscriptionContext";
import Header from "@/components/Header";
import SummaryCards from "@/components/SummaryCards";
import SubscriptionTable from "@/components/SubscriptionTable";
import AddSubscriptionModal from "@/components/AddSubscriptionModal";

const Index = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <SubscriptionProvider>
      <div className="min-h-screen bg-background">
        <Header onAddClick={() => setModalOpen(true)} />
        <main className="container mx-auto px-4 md:px-6 py-8 space-y-8 max-w-5xl">
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-1">Overview</h2>
            <p className="text-sm text-muted-foreground mb-5">Track your recurring expenses at a glance.</p>
            <SummaryCards />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground mb-4">All Subscriptions</h2>
            <SubscriptionTable />
          </div>
        </main>
        <AddSubscriptionModal open={modalOpen} onOpenChange={setModalOpen} />
      </div>
    </SubscriptionProvider>
  );
};

export default Index;

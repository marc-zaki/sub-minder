import mongoose, { Document, Schema } from "mongoose";

export type BillingCycle = "Monthly" | "Yearly";
export type Category = "Streaming" | "Software" | "Utility" | "Other";
export type SubStatus = "Active" | "Cancelled";

export interface ISubscription extends Document {
  _id: any;
  name: string;
  cost: number;
  cycle: BillingCycle;
  nextDueDate: Date;
  category: Category;
  status: SubStatus;
  createdAt: Date;
  updatedAt: Date;
}


const subscriptionSchema = new Schema<ISubscription>(
  {
    name: { type: String, required: true },
    cost: { type: Number, required: true },
    cycle: { type: String, enum: ["Monthly", "Yearly"], required: true },
    nextDueDate: { type: Date, required: true },
    category: { type: String, enum: ["Streaming", "Software", "Utility", "Other"], required: true },
    status: { type: String, enum: ["Active", "Cancelled"], default: "Active", required: true },
  },
  { timestamps: true }
);

// add virtual id when converting to JSON
subscriptionSchema.virtual("id").get(function () {
  return this._id.toString();
});
subscriptionSchema.set("toJSON", { virtuals: true });

export const Subscription = mongoose.model<ISubscription>("Subscription", subscriptionSchema);

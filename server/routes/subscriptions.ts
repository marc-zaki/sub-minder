import { Router } from "express";
import { Subscription } from "../models/Subscription";
import { addMonths, addYears } from "date-fns";

const router = Router();

// GET all
router.get("/", async (req, res) => {
  const subs = await Subscription.find().sort({ nextDueDate: 1 });
  res.json(subs);
});

// POST new
router.post("/", async (req, res) => {
  try {
    const { name, cost, cycle, nextDueDate, category } = req.body;
    const sub = new Subscription({ name, cost, cycle, nextDueDate, category });
    await sub.save();
    // send back cleaned object with id field
    const obj = sub.toObject({ versionKey: false });
    obj.id = obj._id;
    delete obj._id;
    res.status(201).json(obj);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown" });
  }
});

// PATCH cancel
router.patch("/:id/cancel", async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: "Not found" });
    sub.status = "Cancelled";
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown" });
  }
});

// PATCH renew
router.patch("/:id/renew", async (req, res) => {
  try {
    const sub = await Subscription.findById(req.params.id);
    if (!sub) return res.status(404).json({ error: "Not found" });
    if (sub.cycle === "Monthly") {
      sub.nextDueDate = addMonths(sub.nextDueDate, 1);
    } else {
      sub.nextDueDate = addYears(sub.nextDueDate, 1);
    }
    sub.status = "Active";
    await sub.save();
    res.json(sub);
  } catch (err) {
    res.status(400).json({ error: err instanceof Error ? err.message : "Unknown" });
  }
});

export default router;

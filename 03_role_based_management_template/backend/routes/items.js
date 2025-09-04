import express from "express";
import Item from "../models/Item.js";
import { authMiddleware, adminMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const items = await Item.find().populate("createdBy", "name email role _id password ");
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// add item - admin only
router.post("/", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { name, description } = req.body;
      const item = await Item.create({ name, description, createdBy: req.user._id });
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
})

// update item - admin only
router.put("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
      const { name, description } = req.body;
      const item = await Item.findById(req.params.id);
      if (!item) return res.status(404).json({ error: "Item not found" });
      item.name = name;
      item.description = description;
      await item.save();
      res.json(item);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
})

// delete item - admin only
router.delete("/:id", authMiddleware, adminMiddleware, async (req, res) => {
    try {
        const item = await Item.findById(req.params.id);
        if (!item) return res.status(404).json({ error: "Item not found" });
        await item.remove();
        res.json({ message: "Item deleted" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
})

export default router;

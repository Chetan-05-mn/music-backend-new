import express from "express";

import {
  addSubscription,
  getSubscriptions,
  removeSubscription,
  upgradeSubscription
} from "../controllers/subscriptionController.js";

const router = express.Router();


// ================= ADD SUBSCRIPTION =================

router.post(
  "/",
  addSubscription
);


// ================= GET SUBSCRIPTIONS =================

router.get(
  "/",
  getSubscriptions
);


// ================= REMOVE SUBSCRIPTION =================

router.delete(
  "/",
  removeSubscription
);


// ================= UPGRADE SUBSCRIPTION =================

router.post(
  "/upgrade",
  upgradeSubscription
);


export default router;
import { Router } from "express";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { userRouter } from "@/api/user/userRouter";
import { authRouter } from "@/api/auth/authRouter";
import { teamRouter } from "@/api/team/teamRouter";
import { workspaceRouter } from "@/api/workspace/workspaceRouter";
import { panaRouter } from "@/api/pana/panaRouter";
import { blockRouter } from "@/api/block/blockRouter";

const router = Router();

router.use("/health-check", healthCheckRouter);
router.use("/users", userRouter);
router.use("/", authRouter)
router.use("/teams", teamRouter)
router.use("/workspaces", workspaceRouter)
router.use("/panas", panaRouter)
router.use("/", blockRouter)

export { router };
import { WorkspaceRepository } from "@/api/workspace/workspaceRepository";
import { AuthRequest } from "@/common/middleware/auth";
import { RequestIdSource } from "@/common/types";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const checkWorkspace = (options: {
    checkOwnerShip?: boolean,
    source?: RequestIdSource,
    key?: string
} = {}) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { source = 'params', key = 'id', checkOwnerShip } = options
        const workspaceId: string = source === 'cookie' ? req.userData?.activeWorkspace : req[source][key]

        if (!workspaceId)
            return res.status(StatusCodes.BAD_REQUEST).json({ message: "Workspace ID not found." })

        const workspace = await new WorkspaceRepository().findById(workspaceId)

        if (!workspace)
            return res.status(StatusCodes.NOT_FOUND).json({ message: "Workspace not found." })

        if (!checkOwnerShip) next()

        if (workspace.ownerId !== req.userData?._id)
            return res.status(StatusCodes.FORBIDDEN).json({ message: "Not Authorized." })

        next()
    } catch (error) {
        console.error("Workspace verificartion failed")
        return res.status(StatusCodes.FORBIDDEN).json({ message: "Workspace Verification Failed" })
    }
}
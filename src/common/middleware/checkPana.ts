import { PanaRepository } from "@/api/pana/panaRepository";
import { WorkspaceRepository } from "@/api/workspace/workspaceRepository";
import { AuthRequest } from "@/common/middleware/auth";
import { RequestIdSource } from "@/common/types";
import { NextFunction, Response } from "express";
import { StatusCodes } from "http-status-codes";

export const checkPana = (options: {
    checkOwnership?: boolean,
    source?: Exclude<RequestIdSource, 'cookie'>,
    key?: string,
} = {}) => async (req: AuthRequest, res: Response, next: NextFunction) => {
    const { checkOwnership, source = 'params', key = 'id' } = options

    const panaId = req[source][key]

    if (!panaId)
        res.status(StatusCodes.BAD_REQUEST).json({ message: 'No Pana Id.' })

    const pana = await new PanaRepository().findById(panaId)

    if (!pana)
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Pana not found.' })

    if (!checkOwnership) next()

    if (!pana.workspaceId)
        res.status(StatusCodes.NOT_FOUND).json({ message: 'No workspace associated.' })

    const associatedWorkspace = await new WorkspaceRepository().findById(pana.workspaceId)

    if (!associatedWorkspace)
        res.status(StatusCodes.NOT_FOUND).json({ message: 'Associated workspace not found.' })

    if (associatedWorkspace.ownerId !== req.userData?._id)
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Not Authorized.' })

    next()
}
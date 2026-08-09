import { AuthRequest } from "@/common/middleware/auth";
import { RequestHandler, Response } from "express";
import { workspaceService } from "./workspaceService";
import { buildPagination } from "@/common/utils/pagination";
import { StatusCodes } from "http-status-codes";
import { panaService } from "@/api/pana/panaService";

export class WorkspaceController {
    public createWorkspace: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { name, teamId, type } = req.body || {}

        const workspaceData = {
            name,
            type,
            ...(teamId && { teamId }),
            ownerId: req?.userData?._id
        }

        const serviceResponse = await workspaceService.createWorkspace(workspaceData)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public getMyWorkspaces: RequestHandler = async (req: AuthRequest, res: Response) => {
        const pagination = buildPagination(req.query)

        const serviceResponse = await workspaceService.getMyWorkspaces({
            pagination,
            userId: req?.userData?._id!
        })

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public getPanasByWorkspace: RequestHandler = async (req: AuthRequest, res: Response) => {
        const workspaceId = req.params.workspaceId

        if (!workspaceId) return res.status(StatusCodes.NOT_FOUND).send({ message: 'User does not have active workspace' })

        const serviceResponse = await panaService.getActiveWorkspacePanas(workspaceId)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }
}

export const workspaceController = new WorkspaceController()

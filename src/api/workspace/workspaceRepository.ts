import { DocumentWithMetaData, WithPagination } from "@/common/schema";
import { WorkspaceModel } from "./workspaceModel";
import { type Workspace } from "./workspaceSchema";
import { BaseRepository } from "@/common/repository/baseRepository";
import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";

export class WorkspaceRepository extends BaseRepository<Workspace> {
    constructor(model = WorkspaceModel, currentUser = new AsyncLocalStorageCurrentUser()) {
        super(model, currentUser)
    }

    async findByNameAndScope({
        name,
        ownerId,
        teamId,
    }: {
        name: string,
        ownerId?: string;
        teamId?: string;
    }): Promise<Workspace | null> {
        return await WorkspaceModel.findOne({
            name,
            ...(ownerId && { ownerId }),
            ...(teamId && { teamId })
        })
    }

    async findWithPagination({
        pagination,
        filters
    }: WithPagination): Promise<DocumentWithMetaData<Workspace[]>> {
        const { skip, limit, sort } = pagination

        const query = { ...filters }

        const [data, total] = await Promise.all([
            WorkspaceModel.find(query)
                .sort(sort)
                .skip(skip)
                .limit(limit!),
            WorkspaceModel.countDocuments(query)
        ])

        return {
            data,
            meta: {
                total,
                page: pagination?.page || 1,
                limit: limit || 10,
                totalPages: Math.ceil(total / limit!)
            }
        }
    }
}
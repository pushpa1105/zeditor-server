import { PanaModel } from "./panaModel";
import { BaseRepository } from "@/common/repository/baseRepository";
import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";
import { type Pana } from "@/api/pana/panaSchema";

export class PanaRepository extends BaseRepository<Pana> {

    constructor(model = PanaModel, currentUser = new AsyncLocalStorageCurrentUser()) {
        super(model, currentUser)
    }

    async getDescendantIds(id: string): Promise<[string]> {
        const result = await this.model.aggregate([
            {
                $match: {
                    _id: id,
                },
            },
            {
                $graphLookup: {
                    from: "panas",
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentId",
                    as: "descendants",
                },
            },
            {
                $project: {
                    allIds: {
                        $concatArrays: [
                            ["$_id"],
                            {
                                $map: {
                                    input: "$descendants",
                                    as: "d",
                                    in: "$$d._id",
                                },
                            },
                        ],
                    },
                },
            },
        ]);

        return result?.[0]?.allIds ?? [];
    }

    async findByWorkspaceId(workspaceId: string): Promise<Pana[]> {
        return this.model.find({ workspaceId })
    }
}

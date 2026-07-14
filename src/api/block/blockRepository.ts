import { BlockDocument, BlockModel } from "@/api/block/blockModel";
import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";
import { BaseRepository } from "@/common/repository/baseRepository";

export class BlockRepository extends BaseRepository<BlockDocument> {
    constructor(model = BlockModel, currentUser = new AsyncLocalStorageCurrentUser()) {
        super(model, currentUser)
    }

    async upsertMany(blocks: Partial<BlockDocument> & { id: string, panaId: string }[]): Promise<any> {
        return await this.model.bulkWrite(
            blocks.map((block) => {
                const _id = block?.id
                return _id ? {
                    updateOne: {
                        filter: { _id, panaId: block.panaId },
                        update: {
                            $set: block
                        },
                        upsert: true
                    }
                } : {
                    insertOne: {
                        document: block
                    }
                }
            }
            ))
    }

    async findByPanaId(panaId: String): Promise<BlockDocument[]> {
        return this.model.find({ panaId })
    }
}
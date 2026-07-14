import { BlockDocument } from "@/api/block/blockModel";
import { BlockRepository } from "@/api/block/blockRepository";
import { PanaService } from "@/api/pana/panaService";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { ServiceResponse } from "@/common/models/serviceResponse";

export class BlockService {
    private blockRepository: BlockRepository;

    constructor(repository: BlockRepository = new BlockRepository()) {
        this.blockRepository = repository
    }

    @ErrorCatcher("BlockService.fetchBlocksByPanaId")
    async fetchBlocksByPanaId(panaId: string): Promise<ServiceResponse<BlockDocument[] | null>> {
        const pana = await new PanaService().getPanaById(panaId)

        if (!pana) {
            return ServiceResponse.failure('Pana not found', null)
        }

        const blocks = await this.blockRepository.findByPanaId(panaId);

        return ServiceResponse.success('Blocks fetched successfully', blocks)
    }

    @ErrorCatcher("BlockService.addOrUpdateBlocks")
    async addOrUpdateBlocks(panaId: string, blocks: Partial<BlockDocument> & { id: string }[]): Promise<ServiceResponse<Partial<BlockDocument>[] | null>> {
        const { data: pana } = await new PanaService().getPanaById(panaId)

        if (!pana) {
            return ServiceResponse.failure('Pana not found', null)
        }

        const blocksWithPanaId = blocks.map((block) => ({
            ...block,
            panaId,
        }));

        const updatedBlocks = await this.blockRepository.upsertMany(blocksWithPanaId)

        return ServiceResponse.success('Blocks updated successfully', updatedBlocks)
    }

    @ErrorCatcher("BlockService.deleteBlocksById")
    async deleteBlocksById(blockIds: string[]): Promise<ServiceResponse<null>> {
        await this.blockRepository.deleteManyByIds(blockIds)
        return ServiceResponse.success('Blocks deleted successfully', null)
    }
};

export const blockService = new BlockService()

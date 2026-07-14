import { BlockDocument } from "@/api/block/blockModel";
import { blockService } from "@/api/block/blockService";
import { AuthRequest } from "@/common/middleware/auth";
import { RequestHandler, Response } from "express";

export class BlockController {
    public getBlocksByPanaId: RequestHandler = async (req: AuthRequest, res: Response) => {
        const serviceResponse = await blockService.fetchBlocksByPanaId(req.params.id)

        res.status(serviceResponse.statusCode).send({ ...serviceResponse, data: this._buildBlockTree(serviceResponse.data || []) })
    }

    public addOrUpdateBlocks: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { blocks } = req.body || {}
        const panaId = req.params.id

        const serviceResponse = await blockService.addOrUpdateBlocks(panaId, blocks);

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    public deleteBlocksById: RequestHandler = async (req: AuthRequest, res: Response) => {
        const { blockIds } = req.body || {}

        const serviceResponse = await blockService.deleteBlocksById(blockIds)

        res.status(serviceResponse.statusCode).send(serviceResponse)
    }

    /**
     * Turns flat Block documents (each with parentBlock + order) back into
     * the nested array shape BlockNote expects for `initialContent`:
     *   [{ id, type, props, content, children: [...] }, ...]
     */
    private _buildBlockTree(blocks: BlockDocument[]) {
        const byParent: Record<string, BlockDocument[]> = {};
        for (const b of blocks) {
            const key = b.parentId as string || "root";
            if (!byParent[key]) byParent[key] = [];
            byParent[key].push(b);
        }

        // sort each group by order
        Object.values(byParent).forEach((group) => {
            return group.sort((a, b) => {
                if (a.order < b.order) return -1;
                if (a.order > b.order) return 1;
                return 0;
            });
        });

        function attach(blockId: any): Partial<BlockDocument>[] {
            const children = byParent[blockId] || [];
            return children.map((b) => ({
                id: b._id,
                type: b.type,
                props: b.props,
                content: b.content,
                order: b.order,
                parentId: b.parentId,
                children: attach(b._id),
            }));
        }

        return attach("root");
    }

}

export const blockController = new BlockController();

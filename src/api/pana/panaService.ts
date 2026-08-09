import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { PanaRepository } from "./panaRepository";
import { CreatePanaData, type Pana } from "./panaSchema";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { StatusCodes } from "http-status-codes";

export class PanaService {
    private panaRepository: PanaRepository

    constructor(repository = new PanaRepository()) {
        this.panaRepository = repository
    }

    @ErrorCatcher("PanaService.createPana")
    async createPana(panaData: CreatePanaData & {
        parentId?: string,
        workspaceId: string
    }): Promise<ServiceResponse<Pana | null>> {

        if (panaData?.parentId) {
            const existingPana = await this.panaRepository.findById(panaData.parentId);

            if (!existingPana) {
                return ServiceResponse.failure('Pana not found', null, StatusCodes.NOT_FOUND)
            }
        }

        const pana = await this.panaRepository.createOne(panaData);

        return ServiceResponse.success('Pana created successfully', pana)
    }

    @ErrorCatcher("PanaService.getPanaById")
    async getPanaById(panaId: string): Promise<ServiceResponse<Pana | null>> {
        const pana = await this.panaRepository.findById(panaId);

        return ServiceResponse.success('Pana fetched successfully', pana)
    }

    @ErrorCatcher("PanaService.deletePanaById")
    async deletePanaById(panaId: string): Promise<ServiceResponse<any>> {
        const allDescendantIds = await this.panaRepository.getDescendantIds(panaId)

        await this.panaRepository.deleteManyByIds(allDescendantIds)

        return ServiceResponse.success('Pana deleted successfully', null)
    }

    @ErrorCatcher("PanaService.updatePanaById")
    async updatePanaById(panaId: string, panaData: Partial<Pana>): Promise<ServiceResponse<any>> {

        const updatedPana = await this.panaRepository.updateById(panaId, panaData)

        return ServiceResponse.success('Pana updated successfully', updatedPana)
    }

    @ErrorCatcher("PanaService.getActiveWorkspacePanas")
    async getActiveWorkspacePanas(workspaceId: string): Promise<ServiceResponse<Pana[] | null>> {
        const panas = await this.panaRepository.findByWorkspaceId(workspaceId)

        return ServiceResponse.success('Panas for workspace fetched successfully', panas)
    }
}

export const panaService = new PanaService()

import { ServiceResponse } from "@/common/models/serviceResponse";
import { TeamRepository } from "./teamRepository";
import { CreateTeamData, type Team } from "./teamSchema";
import { StatusCodes } from "http-status-codes";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";

export class TeamService {
    private teamRepository: TeamRepository;

    constructor(repository: TeamRepository = new TeamRepository()) {
        this.teamRepository = repository
    }

    @ErrorCatcher("Service.createTeam")
    async createTeam(teamData: CreateTeamData & { ownerId: string }): Promise<ServiceResponse<Team | null>> {
        const checkTeamName = await this.teamRepository.findByName(teamData?.name)

        if (checkTeamName) {
            return ServiceResponse.failure(`Team with name "${teamData?.name}" already exists`, null, StatusCodes.CONFLICT)
        }

        const team = await this.teamRepository.createOne(teamData)

        return ServiceResponse.success<Team | null>("Team created successfully", team)
    }
}

export const teamService = new TeamService()

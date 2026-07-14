import { BaseRepository } from "@/common/repository/baseRepository";
import { TeamModel } from "./teamModel";
import { Team } from "./teamSchema";
import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";

export class TeamRepository extends BaseRepository<Team> {

    constructor(model = TeamModel, currentUser = new AsyncLocalStorageCurrentUser()) {
        super(model, currentUser)
    }

    async findByName(name: string): Promise<Team | null> {
        return await TeamModel.findOne({ name }) || null
    }
}
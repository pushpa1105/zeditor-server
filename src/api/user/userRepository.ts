import { AsyncLocalStorageCurrentUser } from "@/common/context/requestContext";
import { UserModel } from "./userModel";
import { type User } from "./userSchema";
import { BaseRepository } from "@/common/repository/baseRepository";

export class UserRepository extends BaseRepository<User> {
	constructor(model = UserModel, currentUser = new AsyncLocalStorageCurrentUser()) {
		super(model, currentUser)
	}

	async findByEmail(email: string): Promise<User | null> {
		return await UserModel.findOne({ email }) || null;
	}
}

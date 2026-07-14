import { StatusCodes } from "http-status-codes";

import { UserRepository } from "@/api/user/userRepository";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { CreateUserData, User } from "./userSchema";
import bcrypt from "bcryptjs";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { workspaceService } from "../workspace/workspaceService";

export class UserService {
	private userRepository: UserRepository;

	constructor(repository: UserRepository = new UserRepository()) {
		this.userRepository = repository;
	}

	@ErrorCatcher("UserService.setActiveWorkspace")
	async setActiveWorkspace(userId: string, workspaceId: string): Promise<ServiceResponse<User | null>> {
		const updatedUser = await this.userRepository.updateById(userId, {
			activeWorkspace: workspaceId
		})

		return ServiceResponse.success('Active Workspace Updated successfully.', updatedUser)
	}

	// Creates a new user in the database
	@ErrorCatcher("Service.createUser")
	async createUser(userData: CreateUserData): Promise<ServiceResponse<User | null>> {
		const verifyUserEmail = await this.userRepository.findByEmail(userData.email)

		if (verifyUserEmail) {
			return ServiceResponse.failure(`User already exists for ${userData.email}`, null, StatusCodes.CONFLICT)
		}

		const hashedPassword = await bcrypt.hash(userData.password, 10)

		userData.password = hashedPassword
		const user = await this.userRepository.createOne(userData)

		const res = await workspaceService.createDefaultWorkspace(user!)

		const serviceResponse = await this.setActiveWorkspace(user?._id as string, res?.data?._id)

		return ServiceResponse.success<User | null>("User created successfully", serviceResponse?.data)
	}

	// Retrieves all users from the database
	@ErrorCatcher("Service.findAll")
	async findAll(): Promise<ServiceResponse<User[] | null>> {
		const users = await this.userRepository.findAll();
		if (!users || users.length === 0) {
			return ServiceResponse.failure("No Users found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success<User[]>("Users found", users);
	}

	// Retrieves a single user by their ID
	@ErrorCatcher("Service.findById")
	async findById(id: string): Promise<ServiceResponse<User | null>> {
		const user = await this.userRepository.findById(id);
		if (!user) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success<User>("User found", user);
	}

	// Retrieves a single user by their ID
	@ErrorCatcher("Service.findByEmail")
	async findByEmail(email: string): Promise<ServiceResponse<User | null>> {
		const user = await this.userRepository.findByEmail(email);
		if (!user) {
			return ServiceResponse.failure("User not found", null, StatusCodes.NOT_FOUND);
		}
		return ServiceResponse.success<User>("User found", user);
	}
}

export const userService = new UserService();

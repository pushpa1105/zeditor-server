import { ServiceResponse } from "@/common/models/serviceResponse";
import { ErrorCatcher } from "@/common/decorators/handleErrorCatcher";
import { UserService } from "@/api/user/userService";
import { CreateUserData, LoginUserData, User } from "../user/userSchema";
import { StatusCodes } from "http-status-codes";
import bcrypt from "bcryptjs";

interface LoginUserResponse {
    user: User;
}

export class AuthService {
    private userService: UserService

    constructor(service: UserService = new UserService()) {
        this.userService = service
    }
    //Retrieves logged in user details
    @ErrorCatcher("Service.getAuthenticatedUser")
    async getAuthenticatedUser(userId: string): Promise<ServiceResponse<User | null>> {
        return await this.userService.findById(userId);
    }

    @ErrorCatcher("Service.createUser")
    async createUser(userData: CreateUserData): Promise<ServiceResponse<User | null>> {
        console.log('HOURRRR')
        return await this.userService.createUser(userData);
    }

    @ErrorCatcher("Service.loginUser")
    async login(loginData: LoginUserData): Promise<ServiceResponse<LoginUserResponse | null>> {
        const serviceResponse = await this.userService.findByEmail(loginData.email)

        let user = serviceResponse?.data

        if (!user) {
            return ServiceResponse.failure(
                "User not found.",
                null,
                StatusCodes.NOT_FOUND
            )
        }

        const passwordMatches = await bcrypt.compare(loginData.password, user.password);

        if (!passwordMatches) {
            return ServiceResponse.failure(
                "Invalid credentials",
                null,
                StatusCodes.UNAUTHORIZED
            )
        }

        return ServiceResponse.success(
            'Success',
            {
                user,
            },
        )
    }
}

export const authService = new AuthService()
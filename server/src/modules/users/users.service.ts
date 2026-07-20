import { ApiError } from "../../utils/api-error.js";
import { usersRepository } from "./users.repository.js";
import { authRepository } from "../auth/auth.repository.js";
import { comparePassword, hashPassword } from "../../utils/bcrypt.js";

export class UsersService {
  async getCurrentUser(userId: string) {
    const user = await usersRepository.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    return user;
  }

  async updateProfile(
    userId: string,
    data: {
      name?: string;
      avatarUrl?: string;
    }
  ) {
    await this.getCurrentUser(userId);

    return usersRepository.updateProfile(userId, data);
  }
  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await authRepository.findUserWithPasswordById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isPasswordCorrect = await comparePassword(currentPassword, user.password!);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Current password is incorrect.");
    }

    const hashedPassword = await hashPassword(newPassword);

    await authRepository.updateUserPassword(userId, hashedPassword);
  }

  async deleteAccount(userId: string, password: string) {
    const user = await authRepository.findUserWithPasswordById(userId);

    if (!user) {
      throw new ApiError(404, "User not found.");
    }

    const isPasswordCorrect = await comparePassword(password, user.password!);

    if (!isPasswordCorrect) {
      throw new ApiError(400, "Incorrect password.");
    }

    await authRepository.deleteUser(userId);
  }
}

export const usersService = new UsersService();

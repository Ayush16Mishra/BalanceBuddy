import { prisma } from "../../database/prisma.js";

export class UsersRepository {
  async findById(userId: string) {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatarUrl: true,
        emailVerified: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateProfile(
  userId: string,
  data: {
    name?: string;
    avatarUrl?: string;
  }
) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data,
    select: {
      id: true,
      email: true,
      name: true,
      avatarUrl: true,
      emailVerified: true,
      authProvider: true,
      createdAt: true,
      updatedAt: true,
    },
  });
}

}

export const usersRepository = new UsersRepository();
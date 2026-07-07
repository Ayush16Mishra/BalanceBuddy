import { prisma } from "../../database/prisma.js";
import { publicUserSelect } from "./user.select.js";

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({
      where: { email },
    });
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  },

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }) {
    return prisma.user.create({
      data,
      select: publicUserSelect,
    });
  },

  async verifyEmail(userId: string) {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        emailVerified: true,
      },
      select: publicUserSelect,
    });
  },

async createPasswordResetToken(data: {
  token: string;
  expiresAt: Date;
  userId: string;
}) {
  return prisma.passwordResetToken.create({
    data,
  });
},

async findPasswordResetToken(token: string) {
  return prisma.passwordResetToken.findUnique({
    where: { token },
    include: {
      user: true,
    },
  });
},

async markPasswordResetTokenAsUsed(id: string) {
  return prisma.passwordResetToken.update({
    where: { id },
    data: {
      usedAt: new Date(),
    },
  });
},

async deleteUnusedPasswordResetTokens(userId: string) {
  return prisma.passwordResetToken.deleteMany({
    where: {
      userId,
      usedAt: null,
    },
  });
},

async updateUserPassword(userId: string, password: string) {
  return prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
},

async findUserWithPasswordById(id: string) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
},


async deleteUser(userId: string) {
  return prisma.user.delete({
    where: {
      id: userId,
    },
  });
},


};
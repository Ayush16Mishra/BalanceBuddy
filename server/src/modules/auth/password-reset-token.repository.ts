import { prisma } from "../../database/prisma.js";

export const passwordResetTokenRepository = {
  async create(data: { userId: string; token: string; expiresAt: Date }) {
    return prisma.passwordResetToken.create({
      data,
    });
  },

  async findByToken(token: string) {
    return prisma.passwordResetToken.findUnique({
      where: {
        token,
      },
    });
  },

  async deleteUnusedByUserId(userId: string) {
    return prisma.passwordResetToken.deleteMany({
      where: {
        userId,
        usedAt: null,
      },
    });
  },

  async markAsUsed(id: string) {
    return prisma.passwordResetToken.update({
      where: {
        id,
      },
      data: {
        usedAt: new Date(),
      },
    });
  },
};

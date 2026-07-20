import { prisma } from "../../database/prisma.js";

export const verificationTokenRepository = {
  async upsert(data: { userId: string; token: string; expiresAt: Date }) {
    await prisma.verificationToken.deleteMany({
      where: {
        userId: data.userId,
      },
    });

    return prisma.verificationToken.create({
      data,
    });
  },

  async findByToken(token: string) {
    return prisma.verificationToken.findUnique({
      where: {
        token,
      },
    });
  },

  async deleteById(id: string) {
    return prisma.verificationToken.delete({
      where: {
        id,
      },
    });
  },
};

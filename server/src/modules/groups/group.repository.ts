import { prisma } from "../../database/prisma.js";
import { CreateGroupInput } from "./group.validation.js";
import type { UpdateGroupInput } from "./group.validation.js";
import crypto from "crypto";

export const groupRepository = {
  async createGroup(userId: string, data: CreateGroupInput) {
    return prisma.group.create({
      data: {
        name: data.name,
        description: data.description,

        memberships: {
          create: {
            userId,
          },
        },
      },
    });
  },

  async getUserGroups(userId: string) {
    return prisma.group.findMany({
      where: {
        memberships: {
          some: {
            userId,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  },

  async getGroupById(groupId: string, userId: string) {
    return prisma.group.findFirst({
      where: {
        id: groupId,
        memberships: {
          some: {
            userId,
          },
        },
      },
      include: {
        memberships: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
          },
        },
        _count: {
          select: {
            memberships: true,
            expenses: true,
          },
        },
      },
    });
  },

  async updateGroup(groupId: string, data: UpdateGroupInput) {
    return prisma.group.update({
      where: {
        id: groupId,
      },
      data,
    });
  },

  async deleteGroup(groupId: string) {
    return prisma.group.delete({
      where: {
        id: groupId,
      },
    });
  },

  async getActiveInvite(groupId: string) {
    return prisma.invite.findFirst({
      where: {
        groupId,
        expiresAt: {
          gt: new Date(),
        },
      },
      orderBy: {
        expiresAt: "desc",
      },
    });
  },

  async createInvite(groupId: string) {
    const token = crypto.randomBytes(32).toString("hex");

    return prisma.invite.create({
      data: {
        groupId,
        token,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      },
    });
  },

  async getInviteByToken(token: string) {
    return prisma.invite.findUnique({
      where: {
        token,
      },
    });
  },

  async isGroupMember(groupId: string, userId: string) {
    return prisma.groupMember.findUnique({
      where: {
        groupId_userId: {
          groupId,
          userId,
        },
      },
    });
  },

  async addGroupMember(groupId: string, userId: string) {
    return prisma.groupMember.create({
      data: {
        groupId,
        userId,
      },
    });
  },
  async hasExpenses(groupId: string) {
    const expense = await prisma.expense.findFirst({
      where: {
        groupId,
      },
      select: {
        id: true,
      },
    });

    return expense !== null;
  },

  async getUserGroupIds(userId: string) {
    const memberships = await prisma.groupMember.findMany({
      where: {
        userId,
      },
      select: {
        groupId: true,
      },
    });

    return memberships.map((membership) => membership.groupId);
  },
  async deleteExpiredInvites() {
    return prisma.invite.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
  },
};

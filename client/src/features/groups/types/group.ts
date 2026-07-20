export interface Group {
  id: string;
  name: string;
  description: string | null;

  createdAt: string;
  updatedAt: string;

  isLocked: boolean;

  _count: {
    memberships: number;
    expenses: number;
  };

  memberships: GroupMember[];
}

export interface GroupMember {
  user: {
    id: string;
    name: string;
    avatarUrl: string | null;
  };

  joinedAt: string;
}

export interface CreateGroupRequest {
  name: string;
  description?: string;
}

export interface JoinGroupRequest {
  token: string;
}

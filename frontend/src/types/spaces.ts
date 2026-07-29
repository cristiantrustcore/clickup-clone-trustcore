export interface Status {
  id: string;
  name: string;
  color: string | null;
  order: number;
  listId: string;
}

export interface Space {
  id: string;
  name: string;
  description: string | null;
  color: string | null;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  _count?: { lists: number };
}

export interface List {
  id: string;
  name: string;
  spaceId: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  statuses: Status[];
}

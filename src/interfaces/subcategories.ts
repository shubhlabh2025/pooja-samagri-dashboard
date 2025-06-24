export interface SubCategories {
  id: string;
  name: string;
  image: string;
  parent_id: string | null;
  priority: number | string;
}

export interface CreateSubCategories {
  name: string;
  image: string;
  parent_id: string | null;
}

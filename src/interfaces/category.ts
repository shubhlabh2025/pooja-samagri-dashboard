export interface Category {
  id: number;
  name: string;
  image: string;
  priority?: number | string;
}

export type CreateCategoryPayload = Omit<Category, "id">;

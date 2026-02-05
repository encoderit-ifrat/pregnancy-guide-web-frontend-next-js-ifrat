import { Category } from "@/types/shared";

export type NavigationLink = {
  href: string;
  label: string;
};

export type CategoriesApiResponse = {
  data: {
    data: Category[];
  };
};

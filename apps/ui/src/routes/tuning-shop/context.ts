import { createContext, useContext, type Dispatch, type SetStateAction } from 'react';

export interface CategoryValues {
  categories: Record<number, Record<string, unknown>>;
  setCategories: Dispatch<SetStateAction<Record<number, Record<string, unknown>>>>;
}

export const CategoryValuesContext = createContext<CategoryValues>(undefined!);

export const useCategoryValues = () => {
  return useContext(CategoryValuesContext);
};

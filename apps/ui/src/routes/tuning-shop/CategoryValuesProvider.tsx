import { type ReactNode } from 'react';
import { CategoryValuesContext, type CategoryValues } from './context';

export default function CategoryValuesProvider({
  categories,
  setCategories,
  children,
}: CategoryValues & { children: ReactNode }) {
  return (
    <CategoryValuesContext.Provider value={{ categories, setCategories }}>{children}</CategoryValuesContext.Provider>
  );
}

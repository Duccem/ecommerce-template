export interface ProductFiltersProps {
  filters: {
    category: string
    minPrice: number
    maxPrice: number
    inStock: boolean
  }
  setFilters: React.Dispatch<
    React.SetStateAction<{
      category: string
      minPrice: number
      maxPrice: number
      inStock: boolean
    }>
  >
}

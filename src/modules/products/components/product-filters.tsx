import { Checkbox } from '@/libs/ui/components/ui/checkbox'
import { Label } from '@/libs/ui/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/libs/ui/components/ui/select'
import { Slider } from '@/libs/ui/components/ui/slider'
import { categories } from '../data'
import { ProductFiltersProps } from '../types/product-filter'

export default function ProductFilters({ filters, setFilters }: ProductFiltersProps) {
  const handleCategoryChange = (value: string) => {
    setFilters((prev) => ({ ...prev, category: value }))
  }

  const handlePriceChange = (value: number[]) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1] || prev.maxPrice,
    }))
  }

  const handleStockChange = (checked: boolean) => {
    setFilters((prev) => ({ ...prev, inStock: checked }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Filtros</h3>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select value={filters.category} onValueChange={handleCategoryChange}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Todas las categorías" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las categorías</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.value} value={category.value}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label>Rango de precio</Label>
              <span className="text-sm text-muted-foreground">
                ${filters.minPrice} - ${filters.maxPrice}
              </span>
            </div>
            <Slider
              defaultValue={[filters.minPrice, filters.maxPrice]}
              max={1000}
              step={10}
              onValueChange={handlePriceChange}
              className="py-4"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="stock" checked={filters.inStock} onCheckedChange={handleStockChange} />
            <Label htmlFor="stock">Solo productos en stock</Label>
          </div>
        </div>
      </div>
    </div>
  )
}

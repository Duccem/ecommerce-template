import placeholder from '@/assets/images/placeholder.svg'
import { Badge } from '@/libs/ui/components/ui/badge'
import { Button } from '@/libs/ui/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader } from '@/libs/ui/components/ui/card'
import { ShoppingCart } from 'lucide-react'
import type { Product } from '../types/product'

interface ProductCardProps {
  product: Product
  addToCart: (product: Product) => void
}

export default function ProductCard({ product, addToCart }: ProductCardProps) {
  return (
    <Card className="overflow-hidden h-full flex flex-col">
      <div className="relative aspect-square">
        <img src={product.image || placeholder.src} alt={product.name} className="object-cover" />
        {!product.inStock && (
          <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
            <Badge variant="destructive" className="text-sm">
              Agotado
            </Badge>
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-muted-foreground">{product.category}</p>
          </div>
          <Badge variant="outline">${product.price.toFixed(2)}</Badge>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 flex-grow">
        <p className="text-sm text-muted-foreground">{product.description}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full" onClick={() => addToCart(product)} disabled={!product.inStock}>
          <ShoppingCart className="h-4 w-4 mr-2" />
          Añadir al carrito
        </Button>
      </CardFooter>
    </Card>
  )
}

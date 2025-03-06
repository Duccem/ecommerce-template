'use client'

import { Button } from '@/libs/ui/components/ui/button'
import { Input } from '@/libs/ui/components/ui/input'
import { Sheet, SheetContent, SheetTrigger } from '@/libs/ui/components/ui/sheet'
import ShoppingCart from '@/modules/cart/components/shipping-cart'
import { CartItem } from '@/modules/cart/types/cart-item'
import ProductCard from '@/modules/products/components/product-card'
import ProductFilters from '@/modules/products/components/product-filters'
import { productData } from '@/modules/products/data'
import { Product } from '@/modules/products/types/product'
import { ShoppingCartIcon as CartIcon, Search } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'

export default function ProductosPage() {
  const [products] = useState<Product[]>(productData)
  const [cart, setCart] = useState<CartItem[]>([])
  const [filters, setFilters] = useState({
    category: '',
    minPrice: 0,
    maxPrice: 1000,
    inStock: false,
  })
  const [searchQuery, setSearchQuery] = useState('')

  const addToCart = (product: Product) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id)

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        )
      } else {
        return [...prevCart, { ...product, quantity: 1 }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    )
  }

  const filteredProducts = products.filter((product) => {
    // Filter by search query
    if (searchQuery && !product.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false
    }

    // Filter by category
    if (filters.category && product.category !== filters.category) {
      return false
    }

    // Filter by price range
    if (product.price < filters.minPrice || product.price > filters.maxPrice) {
      return false
    }

    // Filter by stock
    if (filters.inStock && !product.inStock) {
      return false
    }

    return true
  })

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="flex flex-col min-h-screen">
      <header className="sticky top-0 z-40 w-full border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center">
              <h1 className="text-xl font-bold">Mi Tienda Online</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/" className="text-sm font-medium">
              Inicio
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative">
                  <CartIcon className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <ShoppingCart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
          <h1 className="text-2xl font-bold">Todos los Productos</h1>
          <div className="relative w-full md:w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar productos..."
              className="w-full pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-64 shrink-0">
            <ProductFilters filters={filters} setFilters={setFilters} />
          </aside>

          <main className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} addToCart={addToCart} />
                ))
              ) : (
                <div className="col-span-full text-center py-12">
                  <p className="text-muted-foreground">
                    No se encontraron productos con los filtros seleccionados.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <footer className="mt-auto border-t py-6">
        <div className="container flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-muted-foreground">
              © 2023 Mi Tienda Online. Todos los derechos reservados.
            </p>
          </div>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Términos
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Privacidad
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">
              Contacto
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

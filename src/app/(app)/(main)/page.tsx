'use client'

import { ArrowRight, Badge, ShoppingCartIcon as CartIcon, User } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'

import logo from '@/assets/images/lumen-dark.png'
import { Button } from '@/libs/ui/components/ui/button'
import { Card, CardContent } from '@/libs/ui/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/libs/ui/components/ui/carousel'
import { Separator } from '@/libs/ui/components/ui/separator'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/libs/ui/components/ui/sheet'
import ShoppingCart from '@/modules/cart/components/shipping-cart'
import type { CartItem } from '@/modules/cart/types/cart-item'
import ProductCard from '@/modules/products/components/product-card'
import { productData } from '@/modules/products/data'
import type { Product } from '@/modules/products/types/product'

export default function HomePage() {
  const [products] = useState<Product[]>(productData)
  const [cart, setCart] = useState<CartItem[]>([])

  // Productos patrocinados (destacados)
  const sponsoredProducts = products.filter((product) => product.inStock).slice(0, 4)

  // Productos populares (los primeros 6 productos en stock)
  const popularProducts = products.filter((product) => product.inStock).slice(0, 6)

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

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  return (
    <div className="flex flex-col min-h-screen" suppressContentEditableWarning>
      <header className="sticky top-0 z-40 w-full border-b bg-background flex justify-center items-center">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/" className="flex items-center gap-2">
              <div className="size-10">
                <img src={logo.src} alt="" />
              </div>
              <h1 className="text-xl font-bold">Acme store</h1>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/productos" className="text-sm font-medium">
              Todos los productos
            </Link>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="relative cursor-pointer">
                  <CartIcon className="h-5 w-5" />
                  {cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:max-w-md">
                <SheetHeader className="py-4">
                  <SheetTitle className="text-xl font-bold">Tu Carrito</SheetTitle>
                  <p className="text-sm text-muted-foreground">
                    {cart.length === 0
                      ? 'Tu carrito está vacío'
                      : `${cart.length} ${cart.length === 1 ? 'producto' : 'productos'} en tu carrito`}
                  </p>
                </SheetHeader>
                <Separator />
                <ShoppingCart
                  cart={cart}
                  removeFromCart={removeFromCart}
                  updateQuantity={updateQuantity}
                />
              </SheetContent>
            </Sheet>
            <Button variant="outline" size="icon" className="relative cursor-pointer">
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Banner */}
        <section className="relative">
          <div className="relative h-[500px] w-full overflow-hidden flex justify-center">
            <div className="absolute inset-0 -z-10">
              <img
                src="/placeholder.svg?height=500&width=1200"
                alt="Banner promocional"
                className="object-cover h-full w-full"
              />
            </div>
            <div className="container inset-0  flex flex-col justify-center">
              <div className="max-w-xl space-y-4">
                <Badge className="mb-2">Oferta Especial</Badge>
                <h1 className="text-4xl font-bold tracking-tight">
                  Descubre Nuestra Nueva Colección
                </h1>
                <p className="text-lg">
                  Encuentra los mejores productos con descuentos exclusivos por tiempo limitado.
                </p>
                <Button asChild size="lg" className="mt-4">
                  <Link href="/productos">Comprar Ahora</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Productos Patrocinados */}
        <section className="py-12 bg-muted/30 flex justify-center">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Productos Destacados</h2>
              <Link href="/productos" className="text-sm font-medium flex items-center">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {sponsoredProducts.map((product) => (
                <ProductCard key={product.id} product={product} addToCart={addToCart} />
              ))}
            </div>
          </div>
        </section>

        {/* Banners Promocionales */}
        <section className="py-12 flex justify-center">
          <div className="container">
            <h2 className="text-2xl font-bold tracking-tight mb-8">Ofertas Especiales</h2>
            <Carousel className="w-full">
              <CarouselContent>
                {[1, 2, 3].map((_, index) => (
                  <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                    <Card className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="relative h-[200px] w-full">
                          <Image
                            src={`/placeholder.svg?height=200&width=400&text=Promoción ${index + 1}`}
                            alt={`Promoción ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent flex flex-col justify-end p-6">
                            <h3 className="font-bold">Oferta Especial #{index + 1}</h3>
                            <p className="text-sm">Hasta 50% de descuento</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-2" />
              <CarouselNext className="right-2" />
            </Carousel>
          </div>
        </section>

        {/* Productos Populares */}
        <section className="py-12 bg-muted/30 flex justify-center">
          <div className="container">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold tracking-tight">Productos Populares</h2>
              <Link href="/productos" className="text-sm font-medium flex items-center">
                Ver todos <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {popularProducts.map((product) => (
                <div key={product.id} className="group relative overflow-hidden rounded-lg border">
                  <Link href={`/productos/${product.id}`} className="absolute inset-0 z-10">
                    <span className="sr-only">Ver producto</span>
                  </Link>
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={product.image || '/placeholder.svg'}
                      alt={product.name}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-medium truncate">{product.name}</h3>
                    <p className="text-sm font-bold">${product.price.toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Banner Informativo */}
        <section className="py-12 flex justify-center">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="rounded-full bg-primary-foreground/20 p-3 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M5 12h14"></path>
                      <path d="M12 5v14"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Envío Gratis</h3>
                  <p className="text-sm text-primary-foreground/80">En compras superiores a $99</p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="rounded-full bg-primary-foreground/20 p-3 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Garantía de Calidad</h3>
                  <p className="text-sm text-primary-foreground/80">
                    30 días de garantía en todos los productos
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-primary text-primary-foreground">
                <CardContent className="flex flex-col items-center text-center p-6">
                  <div className="rounded-full bg-primary-foreground/20 p-3 mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-6 w-6"
                    >
                      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                      <circle cx="12" cy="10" r="3"></circle>
                    </svg>
                  </div>
                  <h3 className="font-bold mb-1">Soporte 24/7</h3>
                  <p className="text-sm text-primary-foreground/80">
                    Atención al cliente todos los días
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-6 md:py-10 flex justify-center">
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

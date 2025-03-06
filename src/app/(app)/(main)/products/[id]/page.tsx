'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/libs/ui/components/ui/accordion'
import { Badge } from '@/libs/ui/components/ui/badge'
import { Button } from '@/libs/ui/components/ui/button'
import { Label } from '@/libs/ui/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/libs/ui/components/ui/radio-group'
import { Sheet, SheetContent, SheetTrigger } from '@/libs/ui/components/ui/sheet'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/libs/ui/components/ui/tabs'
import { cn } from '@/libs/ui/lib/utils'
import ShoppingCart from '@/modules/cart/components/shipping-cart'
import { CartItem } from '@/modules/cart/types/cart-item'
import { productData } from '@/modules/products/data'
import { ShoppingCartIcon as CartIcon, Check, Heart, Share2, Star, X } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound, useParams } from 'next/navigation'
import { useState } from 'react'

export default function ProductDetailPage() {
  const { id: productId } = useParams()
  const product = productData.find((p) => p.id === productId)

  if (!product) {
    notFound()
  }

  const [cart, setCart] = useState<CartItem[]>([])
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState('default')
  const [selectedSize, setSelectedSize] = useState('m')

  // Imágenes de producto simuladas (en un caso real, vendrían del backend)
  const productImages = [
    product.image,
    '/placeholder.svg?height=600&width=600&text=Vista+2',
    '/placeholder.svg?height=600&width=600&text=Vista+3',
    '/placeholder.svg?height=600&width=600&text=Vista+4',
  ]

  // Colores disponibles (simulados)
  const availableColors = [
    { id: 'default', name: 'Predeterminado', value: 'bg-slate-900' },
    { id: 'blue', name: 'Azul', value: 'bg-blue-500' },
    { id: 'red', name: 'Rojo', value: 'bg-red-500' },
  ]

  // Tallas disponibles (simuladas)
  const availableSizes = [
    { id: 's', label: 'S', available: true },
    { id: 'm', label: 'M', available: true },
    { id: 'l', label: 'L', available: true },
    { id: 'xl', label: 'XL', available: false },
  ]

  // Especificaciones del producto (simuladas)
  const specifications = [
    { name: 'Material', value: 'Algodón 100%' },
    { name: 'Peso', value: '250g' },
    { name: 'Dimensiones', value: '30 x 20 x 10 cm' },
    { name: 'País de origen', value: 'España' },
    { name: 'Código de producto', value: `SKU-${product.id}${product.id}${product.id}` },
  ]

  // Reseñas de clientes (simuladas)
  const reviews = [
    {
      id: 1,
      author: 'María García',
      rating: 5,
      date: '15/03/2023',
      content: 'Excelente producto, muy buena calidad y entrega rápida. Lo recomiendo totalmente.',
    },
    {
      id: 2,
      author: 'Juan Pérez',
      rating: 4,
      date: '02/02/2023',
      content:
        'Buen producto, cumple con lo esperado. La entrega fue un poco lenta pero llegó en perfectas condiciones.',
    },
    {
      id: 3,
      author: 'Ana Martínez',
      rating: 5,
      date: '18/01/2023',
      content:
        'Me encantó, es exactamente como se ve en las fotos. Muy buena relación calidad-precio.',
    },
  ]

  const addToCart = () => {
    const productToAdd = {
      ...product,
      color: selectedColor,
      size: selectedSize,
    }

    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) =>
          item.id === product.id && item.color === selectedColor && item.size === selectedSize,
      )

      if (existingItemIndex >= 0) {
        const newCart = [...prevCart]
        newCart[existingItemIndex].quantity += quantity
        return newCart
      } else {
        return [...prevCart, { ...productToAdd, quantity }]
      }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId))
  }

  const updateCartQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, quantity } : item)),
    )
  }

  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0)

  // Calcular rating promedio
  const averageRating = reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length

  // Productos relacionados (misma categoría)
  const relatedProducts = productData
    .filter((p) => p.category === product.category && p.id !== product.id)
    .slice(0, 4)

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
            <Link href="/productos" className="text-sm font-medium">
              Productos
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
                  updateQuantity={updateCartQuantity}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">
            Inicio
          </Link>
          <span>/</span>
          <Link href="/productos" className="hover:text-foreground">
            Productos
          </Link>
          <span>/</span>
          <Link href={`/productos?category=${product.category}`} className="hover:text-foreground">
            {product.category}
          </Link>
          <span>/</span>
          <span className="text-foreground">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Galería de imágenes */}
          <div className="space-y-4">
            <div className="relative aspect-square overflow-hidden rounded-lg border bg-muted">
              <Image
                src={productImages[selectedImage] || '/placeholder.svg'}
                alt={product.name}
                fill
                className="object-cover"
                priority
              />
              {!product.inStock && (
                <div className="absolute top-4 left-4">
                  <Badge variant="destructive" className="text-sm">
                    Agotado
                  </Badge>
                </div>
              )}
            </div>
            <div className="grid grid-cols-4 gap-2">
              {productImages.map((image, index) => (
                <button
                  key={index}
                  className={cn(
                    'relative aspect-square overflow-hidden rounded-md border hover:border-primary',
                    selectedImage === index && 'ring-2 ring-primary ring-offset-2',
                  )}
                  onClick={() => setSelectedImage(index)}
                >
                  <Image
                    src={image || '/placeholder.svg'}
                    alt={`${product.name} - Vista ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* Información del producto */}
          <div className="space-y-8">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="text-sm">
                  {product.category}
                </Badge>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Share2 className="h-4 w-4" />
                  <span className="sr-only">Compartir</span>
                </Button>
              </div>

              <h1 className="text-3xl font-bold">{product.name}</h1>

              <div className="flex items-center gap-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {averageRating.toFixed(1)} ({reviews.length} reseñas)
                </span>
              </div>
            </div>

            <div>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>
                {product.price > 50 && (
                  <p className="text-lg text-muted-foreground line-through">
                    ${(product.price * 1.2).toFixed(2)}
                  </p>
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Impuestos incluidos. Envío calculado en el checkout.
              </p>
            </div>

            <div className="space-y-6">
              {/* Selector de color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="color" className="text-base">
                    Color
                  </Label>
                  <span className="text-sm font-medium capitalize">{selectedColor}</span>
                </div>
                <RadioGroup
                  id="color"
                  value={selectedColor}
                  onValueChange={setSelectedColor}
                  className="flex gap-2"
                >
                  {availableColors.map((color) => (
                    <Label
                      key={color.id}
                      htmlFor={`color-${color.id}`}
                      className={cn(
                        'relative cursor-pointer rounded-full p-1 ring-offset-2 transition-all hover:scale-110',
                        selectedColor === color.id && 'ring-2 ring-primary',
                      )}
                    >
                      <RadioGroupItem
                        id={`color-${color.id}`}
                        value={color.id}
                        className="sr-only"
                      />
                      <div className={cn('h-8 w-8 rounded-full', color.value)} title={color.name} />
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Selector de talla */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="size" className="text-base">
                    Talla
                  </Label>
                  <Link
                    href="#"
                    className="text-xs text-muted-foreground underline underline-offset-4"
                  >
                    Guía de tallas
                  </Link>
                </div>
                <RadioGroup
                  id="size"
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-4 gap-2"
                >
                  {availableSizes.map((size) => (
                    <Label
                      key={size.id}
                      htmlFor={`size-${size.id}`}
                      className={cn(
                        'flex cursor-pointer items-center justify-center rounded-md border p-2 text-center text-sm transition-all',
                        selectedSize === size.id &&
                          'border-primary bg-primary text-primary-foreground',
                        !size.available && 'cursor-not-allowed opacity-50',
                      )}
                    >
                      <RadioGroupItem
                        id={`size-${size.id}`}
                        value={size.id}
                        disabled={!size.available}
                        className="sr-only"
                      />
                      {size.label}
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              {/* Estado de disponibilidad */}
              <div className="flex items-center gap-2 text-sm">
                {product.inStock ? (
                  <>
                    <Check className="h-4 w-4 text-green-500" />
                    <span className="font-medium text-green-600">En stock</span>
                    <span className="text-muted-foreground">- Envío en 24-48h</span>
                  </>
                ) : (
                  <>
                    <X className="h-4 w-4 text-red-500" />
                    <span className="font-medium text-red-600">Agotado</span>
                    <span className="text-muted-foreground">- Disponible en 2-3 semanas</span>
                  </>
                )}
              </div>

              {/* Selector de cantidad y botones */}
              <div className="space-y-4 pt-4">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    disabled={!product.inStock}
                  >
                    -
                  </Button>
                  <span className="w-12 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    disabled={!product.inStock}
                  >
                    +
                  </Button>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                  <Button
                    className="flex-1"
                    size="lg"
                    onClick={addToCart}
                    disabled={!product.inStock}
                  >
                    <CartIcon className="mr-2 h-5 w-5" />
                    {product.inStock ? 'Añadir al carrito' : 'Agotado'}
                  </Button>
                  <Button variant="outline" size="lg">
                    <Heart className="mr-2 h-5 w-5" />
                    Añadir a favoritos
                  </Button>
                </div>
              </div>
            </div>

            {/* Descripción corta */}
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p>{product.description}</p>
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
                exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
            </div>

            {/* Características destacadas */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Envío gratuito</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Devolución en 30 días</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Garantía de 2 años</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="h-4 w-4 text-primary" />
                <span>Atención 24/7</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de información adicional */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="description">Descripción</TabsTrigger>
              <TabsTrigger value="specifications">Especificaciones</TabsTrigger>
              <TabsTrigger value="reviews">Reseñas</TabsTrigger>
              <TabsTrigger value="shipping">Envío y devoluciones</TabsTrigger>
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose max-w-none">
                <h3>Descripción del producto</h3>
                <p>
                  {product.description} Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
                  veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
                  consequat.
                </p>
                <p>
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                  fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                  culpa qui officia deserunt mollit anim id est laborum.
                </p>
                <h4>Características principales</h4>
                <ul>
                  <li>Alta calidad y durabilidad garantizada</li>
                  <li>Diseño moderno y elegante</li>
                  <li>Materiales premium seleccionados</li>
                  <li>Fabricación sostenible y responsable</li>
                  <li>Versatilidad para múltiples usos</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="specifications" className="pt-6">
              <div className="overflow-hidden rounded-lg border">
                <table className="w-full text-sm">
                  <tbody>
                    {specifications.map((spec, index) => (
                      <tr key={index} className={index % 2 === 0 ? 'bg-muted/50' : ''}>
                        <td className="px-4 py-3 font-medium">{spec.name}</td>
                        <td className="px-4 py-3">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-8">
                <div className="flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/3 space-y-4">
                    <div className="text-center">
                      <div className="text-5xl font-bold">{averageRating.toFixed(1)}</div>
                      <div className="flex justify-center my-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < Math.round(averageRating) ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Basado en {reviews.length} reseñas
                      </p>
                    </div>

                    <Button className="w-full">Escribir una reseña</Button>
                  </div>

                  <div className="md:w-2/3 space-y-6">
                    {reviews.map((review) => (
                      <div key={review.id} className="space-y-2 pb-6 border-b last:border-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{review.author}</h4>
                            <div className="flex items-center gap-2">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${i < review.rating ? 'fill-primary text-primary' : 'text-muted-foreground'}`}
                                  />
                                ))}
                              </div>
                              <span className="text-xs text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            Compra verificada
                          </Badge>
                        </div>
                        <p className="text-sm">{review.content}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-6">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="shipping">
                    <AccordionTrigger>Información de envío</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 text-sm">
                        <p>Ofrecemos las siguientes opciones de envío:</p>
                        <ul className="list-disc pl-5 space-y-2">
                          <li>
                            <span className="font-medium">Envío estándar:</span> 3-5 días hábiles
                            (gratuito en pedidos superiores a $99)
                          </li>
                          <li>
                            <span className="font-medium">Envío express:</span> 1-2 días hábiles
                            ($9.99)
                          </li>
                          <li>
                            <span className="font-medium">Envío internacional:</span> 7-14 días
                            hábiles (tarifas variables)
                          </li>
                        </ul>
                        <p>
                          Todos los pedidos son procesados y enviados en un plazo de 24 horas (días
                          hábiles).
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="returns">
                    <AccordionTrigger>Política de devoluciones</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 text-sm">
                        <p>
                          Aceptamos devoluciones dentro de los 30 días posteriores a la recepción
                          del pedido.
                        </p>
                        <p>
                          Para ser elegible para una devolución, el artículo debe estar sin usar y
                          en las mismas condiciones en que lo recibió. También debe estar en el
                          embalaje original.
                        </p>
                        <p>
                          Para iniciar una devolución, póngase en contacto con nuestro servicio de
                          atención al cliente.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="warranty">
                    <AccordionTrigger>Garantía</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4 text-sm">
                        <p>
                          Todos nuestros productos incluyen una garantía de 2 años que cubre
                          defectos de fabricación.
                        </p>
                        <p>
                          La garantía no cubre daños causados por uso indebido, accidentes o
                          desgaste normal.
                        </p>
                        <p>
                          Para reclamar la garantía, póngase en contacto con nuestro servicio de
                          atención al cliente con su número de pedido y una descripción del
                          problema.
                        </p>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Productos relacionados */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Productos relacionados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <div
                key={relatedProduct.id}
                className="group relative overflow-hidden rounded-lg border"
              >
                <Link href={`/productos/${relatedProduct.id}`} className="absolute inset-0 z-10">
                  <span className="sr-only">Ver producto</span>
                </Link>
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={relatedProduct.image || '/placeholder.svg'}
                    alt={relatedProduct.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h3 className="font-medium">{relatedProduct.name}</h3>
                  <p className="font-bold mt-1">${relatedProduct.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
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

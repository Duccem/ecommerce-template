import { Badge } from '@/libs/ui/components/ui/badge'
import { Button } from '@/libs/ui/components/ui/button'
import { ScrollArea } from '@/libs/ui/components/ui/scroll-area'
import { Separator } from '@/libs/ui/components/ui/separator'
import { Minus, Plus, Trash2 } from 'lucide-react'
import Image from 'next/image'
import type { CartItem } from '../types/cart-item'

interface ShoppingCartProps {
  cart: CartItem[]
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
}

export default function ShoppingCart({ cart, removeFromCart, updateQuantity }: ShoppingCartProps) {
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = subtotal > 0 ? 9.99 : 0
  const total = subtotal + shipping

  return (
    <div className="flex flex-col h-full">
      <div className="py-4">
        <h2 className="text-xl font-bold">Tu Carrito</h2>
        <p className="text-sm text-muted-foreground">
          {cart.length === 0
            ? 'Tu carrito está vacío'
            : `${cart.length} ${cart.length === 1 ? 'producto' : 'productos'} en tu carrito`}
        </p>
      </div>

      <Separator />

      {cart.length > 0 ? (
        <>
          <ScrollArea className="flex-1 py-4">
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-4">
                  <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0">
                    <Image
                      src={item.image || '/placeholder.svg'}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-sm">{item.name}</h4>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      {item.color && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-auto">
                          {item.color}
                        </Badge>
                      )}
                      {item.size && (
                        <Badge variant="outline" className="text-xs px-1 py-0 h-auto">
                          Talla: {item.size.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                      <span className="text-sm w-6 text-center">{item.quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      >
                        <Plus className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6 ml-auto text-muted-foreground"
                        onClick={() => removeFromCart(item.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          <div className="pt-4 space-y-4">
            <Separator />
            <div className="space-y-1.5">
              <div className="flex justify-between">
                <span className="text-sm">Subtotal</span>
                <span className="text-sm font-medium">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Envío</span>
                <span className="text-sm font-medium">${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Button className="w-full">Proceder al pago</Button>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center py-8">
          <p className="text-muted-foreground mb-4">Tu carrito está vacío</p>
          <Button variant="outline">Continuar comprando</Button>
        </div>
      )}
    </div>
  )
}

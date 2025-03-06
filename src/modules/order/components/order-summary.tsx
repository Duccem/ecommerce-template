import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/libs/ui/components/ui/card'
import { Separator } from '@/libs/ui/components/ui/separator'
import { CartItem } from '@/modules/cart/types/cart-item'
import Image from 'next/image'

interface OrderSummaryProps {
  cart: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  shippingMethod: string
}

export default function OrderSummary({
  cart,
  subtotal,
  shipping,
  tax,
  total,
  shippingMethod,
}: OrderSummaryProps) {
  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Resumen del pedido</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-4">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="relative h-16 w-16 rounded overflow-hidden flex-shrink-0 border">
                <Image
                  src={item.image || '/placeholder.svg'}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.name}</h4>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-sm text-muted-foreground">Cant: {item.quantity}</p>
                  <p className="text-sm font-medium">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío ({shippingMethod === 'express' ? 'Express' : 'Estándar'})</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Impuestos (21%)</span>
            <span>${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between font-medium">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="bg-muted/50 text-xs text-muted-foreground px-6 py-3">
        <p>Los precios incluyen IVA. El pago se realizará en euros (€).</p>
      </CardFooter>
    </Card>
  )
}

import { Button } from '@/libs/ui/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/libs/ui/components/ui/card'
import { Separator } from '@/libs/ui/components/ui/separator'
import { CartItem } from '@/modules/cart/types/cart-item'
import { ArrowRight, CheckCircle2, Package, Printer } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface OrderConfirmationProps {
  orderData: {
    orderId: string
    orderDate: string
  }
  shippingData: {
    firstName: string
    lastName: string
    email: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    shippingMethod: string
  }
  cart: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  onBackToShopping: () => void
}

export default function OrderConfirmation({
  orderData,
  shippingData,
  cart,
  subtotal,
  shipping,
  tax,
  total,
  onBackToShopping,
}: OrderConfirmationProps) {
  // Formatear fecha
  const orderDate = new Date(orderData.orderDate)
  const formattedDate = orderDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Calcular fecha estimada de entrega (3-5 días para estándar, 1-2 para express)
  const deliveryDays = shippingData.shippingMethod === 'express' ? 2 : 5
  const deliveryDate = new Date(orderDate)
  deliveryDate.setDate(deliveryDate.getDate() + deliveryDays)
  const formattedDeliveryDate = deliveryDate.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-8">
      <div className="text-center space-y-3">
        <div className="flex justify-center">
          <CheckCircle2 className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold">¡Pedido completado con éxito!</h2>
        <p className="text-muted-foreground">
          Gracias por tu compra. Hemos enviado un correo de confirmación a{' '}
          <span className="font-medium">{shippingData.email}</span>.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Detalles del pedido</CardTitle>
          <CardDescription>
            Pedido #{orderData.orderId} • {formattedDate}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Información de envío</h3>
              <div className="text-sm">
                <p className="font-medium">
                  {shippingData.firstName} {shippingData.lastName}
                </p>
                <p>{shippingData.address}</p>
                <p>
                  {shippingData.postalCode}, {shippingData.city}
                </p>
                <p>
                  {shippingData.state}, {shippingData.country}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="font-medium text-sm">Método de envío</h3>
              <div className="flex items-start gap-2">
                <Package className="h-5 w-5 text-muted-foreground" />
                <div className="text-sm">
                  <p className="font-medium">
                    {shippingData.shippingMethod === 'express'
                      ? 'Envío Express (1-2 días)'
                      : 'Envío Estándar (3-5 días)'}
                  </p>
                  <p className="text-muted-foreground">Entrega estimada: {formattedDeliveryDate}</p>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h3 className="font-medium text-sm">Productos</h3>
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
                    <p className="text-sm font-medium">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
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
              <span>
                Envío ({shippingData.shippingMethod === 'express' ? 'Express' : 'Estándar'})
              </span>
              <span>${shipping.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (21%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between font-medium text-base pt-2">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-between">
          <Button variant="outline" size="sm" className="w-full sm:w-auto">
            <Printer className="mr-2 h-4 w-4" />
            Imprimir recibo
          </Button>
          <Button onClick={onBackToShopping} className="w-full sm:w-auto">
            Seguir comprando
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>

      <div className="bg-muted/50 p-4 rounded-lg">
        <h3 className="font-medium mb-2">¿Qué sucede ahora?</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
          <li>Recibirás un correo electrónico de confirmación con los detalles de tu pedido.</li>
          <li>Prepararemos tu pedido y te notificaremos cuando se envíe.</li>
          <li>
            Podrás hacer seguimiento de tu pedido con el número de seguimiento que te enviaremos.
          </li>
          <li>¡Disfruta de tus productos cuando lleguen!</li>
        </ol>
      </div>

      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-4">
          ¿Tienes alguna pregunta sobre tu pedido?
        </p>
        <Link href="/contacto" className="text-sm font-medium underline underline-offset-4">
          Contacta con nuestro servicio de atención al cliente
        </Link>
      </div>
    </div>
  )
}

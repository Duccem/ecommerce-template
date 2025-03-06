'use client'

import { Card, CardContent } from '@/libs/ui/components/ui/card'
import { CartItem } from '@/modules/cart/types/cart-item'
import OrderConfirmation from '@/modules/order/components/order-confirmation'
import OrderSummary from '@/modules/order/components/order-summary'
import PaymentForm from '@/modules/order/components/payment-form'
import ShippingForm from '@/modules/order/components/shipping-form'
import { productData } from '@/modules/products/data'
import { ShoppingCartIcon as CartIcon, Check, ChevronRight, CreditCard, Truck } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Pasos del checkout
const CHECKOUT_STEPS = [
  { id: 'shipping', title: 'Envío' },
  { id: 'payment', title: 'Pago' },
  { id: 'confirmation', title: 'Confirmación' },
]

export default function CheckoutPage() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [cart, setCart] = useState<CartItem[]>([])
  const [formData, setFormData] = useState({
    shipping: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      postalCode: '',
      country: 'España',
      shippingMethod: 'standard',
    },
    payment: {
      cardName: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      saveCard: false,
    },
    order: {
      orderId: '',
      orderDate: '',
    },
  })

  // Cargar el carrito desde localStorage (simulado)
  useEffect(() => {
    // En un caso real, cargaríamos el carrito desde localStorage o una API
    // Aquí simulamos algunos productos en el carrito
    const sampleCart: CartItem[] = [
      { ...productData[0], quantity: 1 },
      { ...productData[2], quantity: 2 },
    ]
    setCart(sampleCart)
  }, [])

  // Calcular totales
  const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0)
  const shipping = formData.shipping.shippingMethod === 'express' ? 9.99 : 4.99
  const tax = subtotal * 0.21 // 21% IVA
  const total = subtotal + shipping + tax

  const handleShippingSubmit = (shippingData: typeof formData.shipping) => {
    setFormData((prev) => ({ ...prev, shipping: shippingData }))
    setCurrentStep(1)
    window.scrollTo(0, 0)
  }

  const handlePaymentSubmit = (paymentData: typeof formData.payment) => {
    setFormData((prev) => ({
      ...prev,
      payment: paymentData,
      order: {
        orderId: `ORD-${Date.now().toString().slice(-6)}`,
        orderDate: new Date().toISOString(),
      },
    }))
    setCurrentStep(2)
    window.scrollTo(0, 0)

    // En un caso real, aquí procesaríamos el pago y crearíamos la orden
    // También limpiaríamos el carrito después de una compra exitosa
  }

  const handleBackToShopping = () => {
    // En un caso real, limpiaríamos el carrito aquí
    router.push('/')
  }

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
            <div className="relative">
              <CartIcon className="h-5 w-5" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {cart.reduce((total, item) => total + item.quantity, 0)}
                </span>
              )}
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 container py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Checkout</h1>

          {/* Indicador de progreso */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              {CHECKOUT_STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      currentStep > index
                        ? 'bg-primary text-primary-foreground'
                        : currentStep === index
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {currentStep > index ? <Check className="h-4 w-4" /> : <span>{index + 1}</span>}
                  </div>
                  <span
                    className={`ml-2 text-sm font-medium ${
                      currentStep >= index ? 'text-foreground' : 'text-muted-foreground'
                    }`}
                  >
                    {step.title}
                  </span>

                  {index < CHECKOUT_STEPS.length - 1 && (
                    <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-8">
            {currentStep === 0 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Truck className="mr-2 h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Información de envío</h2>
                  </div>
                  <ShippingForm initialData={formData.shipping} onSubmit={handleShippingSubmit} />
                </CardContent>
              </Card>
            )}

            {currentStep === 1 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <CreditCard className="mr-2 h-5 w-5 text-primary" />
                    <h2 className="text-xl font-semibold">Información de pago</h2>
                  </div>
                  <PaymentForm
                    initialData={formData.payment}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setCurrentStep(0)}
                  />
                </CardContent>
              </Card>
            )}

            {currentStep === 2 && (
              <OrderConfirmation
                orderData={formData.order}
                shippingData={formData.shipping}
                cart={cart}
                subtotal={subtotal}
                shipping={shipping}
                tax={tax}
                total={total}
                onBackToShopping={handleBackToShopping}
              />
            )}
          </div>

          <div>
            <OrderSummary
              cart={cart}
              subtotal={subtotal}
              shipping={shipping}
              tax={tax}
              total={total}
              shippingMethod={formData.shipping.shippingMethod}
            />
          </div>
        </div>
      </main>

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

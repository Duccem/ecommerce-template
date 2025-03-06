'use client'

import type React from 'react'

import { useState } from 'react'

import { Button } from '@/libs/ui/components/ui/button'
import { Checkbox } from '@/libs/ui/components/ui/checkbox'
import { Input } from '@/libs/ui/components/ui/input'
import { Label } from '@/libs/ui/components/ui/label'
import { Separator } from '@/libs/ui/components/ui/separator'
import { CreditCard, Lock } from 'lucide-react'

interface PaymentFormProps {
  initialData: {
    cardName: string
    cardNumber: string
    expiryDate: string
    cvv: string
    saveCard: boolean
  }
  onSubmit: (data: PaymentFormProps['initialData']) => void
  onBack: () => void
}

export default function PaymentForm({ initialData, onSubmit, onBack }: PaymentFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    // Formatear número de tarjeta con espacios cada 4 dígitos
    if (name === 'cardNumber') {
      const formatted = value
        .replace(/\s/g, '') // Eliminar espacios existentes
        .replace(/\D/g, '') // Permitir solo dígitos
        .slice(0, 16) // Limitar a 16 dígitos
        .replace(/(\d{4})(?=\d)/g, '$1 ') // Añadir espacio cada 4 dígitos

      setFormData((prev) => ({ ...prev, [name]: formatted }))
    }
    // Formatear fecha de expiración como MM/YY
    else if (name === 'expiryDate') {
      const cleaned = value.replace(/\D/g, '').slice(0, 4)
      let formatted = cleaned

      if (cleaned.length > 2) {
        formatted = `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
      }

      setFormData((prev) => ({ ...prev, [name]: formatted }))
    }
    // Formatear CVV (solo dígitos, máximo 4)
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').slice(0, 4)
      setFormData((prev) => ({ ...prev, [name]: formatted }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, saveCard: checked }))
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validaciones básicas
    if (!formData.cardName.trim()) newErrors.cardName = 'El nombre es obligatorio'

    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = 'El número de tarjeta es obligatorio'
    } else if (formData.cardNumber.replace(/\s/g, '').length < 16) {
      newErrors.cardNumber = 'Número de tarjeta inválido'
    }

    if (!formData.expiryDate.trim()) {
      newErrors.expiryDate = 'La fecha de expiración es obligatoria'
    } else {
      const [month, year] = formData.expiryDate.split('/')
      const currentYear = new Date().getFullYear() % 100 // Obtener últimos 2 dígitos del año
      const currentMonth = new Date().getMonth() + 1 // Enero es 0

      if (!month || !year || month.length !== 2 || year.length !== 2) {
        newErrors.expiryDate = 'Formato inválido (MM/YY)'
      } else if (Number.parseInt(month) < 1 || Number.parseInt(month) > 12) {
        newErrors.expiryDate = 'Mes inválido'
      } else if (
        Number.parseInt(year) < currentYear ||
        (Number.parseInt(year) === currentYear && Number.parseInt(month) < currentMonth)
      ) {
        newErrors.expiryDate = 'La tarjeta ha expirado'
      }
    }

    if (!formData.cvv.trim()) {
      newErrors.cvv = 'El CVV es obligatorio'
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = 'CVV inválido'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit(formData)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="cardName">Nombre en la tarjeta</Label>
        <Input
          id="cardName"
          name="cardName"
          placeholder="Nombre completo"
          value={formData.cardName}
          onChange={handleChange}
          className={errors.cardName ? 'border-red-500' : ''}
        />
        {errors.cardName && <p className="text-xs text-red-500">{errors.cardName}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="cardNumber">Número de tarjeta</Label>
        <div className="relative">
          <Input
            id="cardNumber"
            name="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={formData.cardNumber}
            onChange={handleChange}
            className={`pl-10 ${errors.cardNumber ? 'border-red-500' : ''}`}
          />
          <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        </div>
        {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Fecha de expiración</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/YY"
            value={formData.expiryDate}
            onChange={handleChange}
            className={errors.expiryDate ? 'border-red-500' : ''}
          />
          {errors.expiryDate && <p className="text-xs text-red-500">{errors.expiryDate}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            placeholder="123"
            value={formData.cvv}
            onChange={handleChange}
            className={errors.cvv ? 'border-red-500' : ''}
          />
          {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="saveCard"
          checked={formData.saveCard}
          onCheckedChange={handleCheckboxChange}
        />
        <Label htmlFor="saveCard" className="text-sm">
          Guardar esta tarjeta para futuras compras
        </Label>
      </div>

      <Separator className="my-6" />

      <div className="bg-muted/50 p-4 rounded-lg flex items-start space-x-3">
        <Lock className="h-5 w-5 text-muted-foreground mt-0.5" />
        <div className="space-y-1">
          <p className="text-sm font-medium">Pago seguro garantizado</p>
          <p className="text-xs text-muted-foreground">
            Tus datos de pago están protegidos con encriptación SSL de 256 bits. No almacenamos los
            detalles completos de tu tarjeta.
          </p>
        </div>
      </div>

      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Volver
        </Button>
        <Button type="submit">Completar pedido</Button>
      </div>
    </form>
  )
}

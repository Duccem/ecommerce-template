'use client'

import { Button } from '@/libs/ui/components/ui/button'
import { Input } from '@/libs/ui/components/ui/input'
import { Label } from '@/libs/ui/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/libs/ui/components/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/libs/ui/components/ui/select'
import { Separator } from '@/libs/ui/components/ui/separator'
import type React from 'react'

import { useState } from 'react'

interface ShippingFormProps {
  initialData: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: string
    city: string
    state: string
    postalCode: string
    country: string
    shippingMethod: string
  }
  onSubmit: (data: ShippingFormProps['initialData']) => void
}

export default function ShippingForm({ initialData, onSubmit }: ShippingFormProps) {
  const [formData, setFormData] = useState(initialData)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario comienza a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Limpiar error cuando el usuario selecciona un valor
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    // Validaciones básicas
    if (!formData.firstName.trim()) newErrors.firstName = 'El nombre es obligatorio'
    if (!formData.lastName.trim()) newErrors.lastName = 'El apellido es obligatorio'
    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido'
    }
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio'
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria'
    if (!formData.city.trim()) newErrors.city = 'La ciudad es obligatoria'
    if (!formData.state.trim()) newErrors.state = 'La provincia es obligatoria'
    if (!formData.postalCode.trim()) newErrors.postalCode = 'El código postal es obligatorio'

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="firstName">Nombre</Label>
          <Input
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={errors.firstName ? 'border-red-500' : ''}
          />
          {errors.firstName && <p className="text-xs text-red-500">{errors.firstName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Apellidos</Label>
          <Input
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={errors.lastName ? 'border-red-500' : ''}
          />
          {errors.lastName && <p className="text-xs text-red-500">{errors.lastName}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className={errors.email ? 'border-red-500' : ''}
          />
          {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Teléfono</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            className={errors.phone ? 'border-red-500' : ''}
          />
          {errors.phone && <p className="text-xs text-red-500">{errors.phone}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">Dirección</Label>
        <Input
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={errors.address ? 'border-red-500' : ''}
        />
        {errors.address && <p className="text-xs text-red-500">{errors.address}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="city">Ciudad</Label>
          <Input
            id="city"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={errors.city ? 'border-red-500' : ''}
          />
          {errors.city && <p className="text-xs text-red-500">{errors.city}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Provincia</Label>
          <Input
            id="state"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={errors.state ? 'border-red-500' : ''}
          />
          {errors.state && <p className="text-xs text-red-500">{errors.state}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="postalCode">Código Postal</Label>
          <Input
            id="postalCode"
            name="postalCode"
            value={formData.postalCode}
            onChange={handleChange}
            className={errors.postalCode ? 'border-red-500' : ''}
          />
          {errors.postalCode && <p className="text-xs text-red-500">{errors.postalCode}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="country">País</Label>
        <Select
          value={formData.country}
          onValueChange={(value) => handleSelectChange('country', value)}
        >
          <SelectTrigger id="country">
            <SelectValue placeholder="Selecciona un país" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="España">España</SelectItem>
            <SelectItem value="Portugal">Portugal</SelectItem>
            <SelectItem value="Francia">Francia</SelectItem>
            <SelectItem value="Italia">Italia</SelectItem>
            <SelectItem value="Alemania">Alemania</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6" />

      <div className="space-y-4">
        <h3 className="font-medium">Método de envío</h3>

        <RadioGroup
          value={formData.shippingMethod}
          onValueChange={(value) => handleSelectChange('shippingMethod', value)}
          className="space-y-3"
        >
          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="standard" id="standard" />
            <div className="grid gap-1.5">
              <Label htmlFor="standard" className="font-medium">
                Envío estándar (3-5 días hábiles)
              </Label>
              <p className="text-sm text-muted-foreground">€4.99</p>
            </div>
          </div>

          <div className="flex items-start space-x-3 space-y-0">
            <RadioGroupItem value="express" id="express" />
            <div className="grid gap-1.5">
              <Label htmlFor="express" className="font-medium">
                Envío express (1-2 días hábiles)
              </Label>
              <p className="text-sm text-muted-foreground">€9.99</p>
            </div>
          </div>
        </RadioGroup>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full md:w-auto">
          Continuar al pago
        </Button>
      </div>
    </form>
  )
}

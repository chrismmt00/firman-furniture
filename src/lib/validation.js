import { z } from 'zod'

// Server-side input schemas. Every Server Action / Route Handler validates against these
// before touching the database — never trust the client-submitted shape.

export const registerSchema = z.object({
  firstName: z.string().trim().max(100).optional(),
  lastName: z.string().trim().max(100).optional(),
  email: z.string().trim().email().max(255),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
})

export const loginSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(200),
})

export const forgotPasswordSchema = z.object({
  email: z.string().trim().email().max(255),
})

export const resetPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8, 'Password must be at least 8 characters.').max(200),
})

export const checkoutSchema = z.object({
  email: z.string().trim().email('Enter a valid email address.').max(255),
  firstName: z.string().trim().min(1, 'First name is required.').max(100),
  lastName: z.string().trim().min(1, 'Last name is required.').max(100),
  address1: z.string().trim().min(1, 'Address is required.').max(255),
  address2: z.string().trim().max(255).optional().or(z.literal('')),
  city: z.string().trim().min(1, 'City is required.').max(100),
  state: z.string().trim().min(1, 'State is required.').max(100),
  postalCode: z.string().trim().min(1, 'ZIP is required.').max(20),
  phone: z.string().trim().max(30).optional().or(z.literal('')),
  shippingMethod: z.enum(['white-glove', 'standard']),
  // Cart lines: ONLY ids/qty/variant cross the wire; prices are recomputed server-side.
  items: z
    .array(
      z.object({
        id: z.string().uuid(),
        qty: z.number().int().min(1).max(50),
        variant: z.string().max(120).nullable().optional(),
      })
    )
    .min(1, 'Your bag is empty.')
    .max(50),
})

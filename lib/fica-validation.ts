import { z } from 'zod'

// Define validation schemas for each section
const companyDetailsSchema = z.object({
  company_legal_entity: z.string().min(1, 'Company name is required'),
  company_registration_number: z.string().min(1, 'Registration number is required'),
  company_sa_presence: z.string().min(1, 'SA business presence description is required'),
  company_stock_exchange: z.string().optional(),
  company_tax_number: z.string().min(1, 'Tax number is required'),
  company_physical_address: z.string().min(1, 'Physical address is required'),
})

const representativeDetailsSchema = z.object({
  representative_full_name: z.string().min(1, 'Representative name is required'),
  representative_id_number: z.string().min(1, 'ID number is required'),
  representative_physical_address: z.string().min(1, 'Physical address is required'),
  representative_telephone: z.string().min(1, 'Telephone number is required'),
  representative_email: z.string().email('Invalid email address'),
  representative_authority_type: z.string().min(1, 'Authority type is required'),
})

const serviceInformationSchema = z.object({
  service_type: z.enum(['rental', 'transaction', 'other'], {
    required_error: 'Service type is required',
  }),
  service_other_details: z.string().optional(),
  payment_finance_method: z.string().min(1, 'Payment method is required'),
  payment_large_cash: z.boolean(),
})

const businessInformationSchema = z.object({
  business_description: z.string().min(1, 'Business description is required'),
  ownership_structure: z.string().min(1, 'Ownership structure is required'),
})

const uboInformationSchema = z.object({
  ubo_method: z.enum(['control', 'majority', 'executive'], {
    required_error: 'UBO method is required',
  }),
  ubo_details: z.string().min(1, 'UBO details are required'),
  ubo_addresses: z.string().min(1, 'UBO addresses are required'),
})

// Combined schema for the entire form
export const ficaFormSchema = z.object({
  companyDetails: companyDetailsSchema,
  representativeDetails: representativeDetailsSchema,
  serviceInformation: serviceInformationSchema,
  businessInformation: businessInformationSchema,
  uboInformation: uboInformationSchema,
})

// Type for the form data
export type FicaFormData = z.infer<typeof ficaFormSchema>

// Helper function to validate form data
export function validateFicaForm(data: any) {
  try {
    const validatedData = ficaFormSchema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { success: false, errors: error.errors }
    }
    return { success: false, errors: [{ message: 'Validation failed' }] }
  }
}

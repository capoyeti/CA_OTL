'use client'

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Belgrano, Cormorant } from 'next/font/google'
import { toast, Toaster } from 'sonner'
import { ficaFormSchema, type FicaFormData } from '@/lib/fica-validation'
import { ZodError } from 'zod'

const belgrano = Belgrano({ weight: '400', subsets: ['latin'] })
const cormorant = Cormorant({ weight: ['400', '700'], subsets: ['latin'] })

const brandColors = {
  primary: '#0e475f',
  secondary: '#158279',
  accent: '#f37f43',
  background: '#fedba5',
}

const initialFormData: FicaFormData = {
  companyDetails: {
    company_legal_entity: '',
    company_registration_number: '',
    company_sa_presence: '',
    company_stock_exchange: '',
    company_tax_number: '',
    company_physical_address: '',
  },
  representativeDetails: {
    representative_full_name: '',
    representative_id_number: '',
    representative_physical_address: '',
    representative_telephone: '',
    representative_email: '',
    representative_authority_type: '',
  },
  serviceInformation: {
    service_type: 'rental',
    service_other_details: '',
    payment_finance_method: '',
    payment_large_cash: false,
  },
  businessInformation: {
    business_description: '',
    ownership_structure: '',
  },
  uboInformation: {
    ubo_method: 'control',
    ubo_details: '',
    ubo_addresses: '',
  },
}

export default function FicaCddForm() {
  const [formData, setFormData] = useState<FicaFormData>(initialFormData)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrors({})

    try {
      // Validate form data
      const validatedData = ficaFormSchema.parse(formData)

      // Submit to API
      const response = await fetch('/api/fica', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (!response.ok) throw new Error(result.error || 'Submission failed')

      toast.success('FICA form submitted successfully')
      // Optionally reset form
      setFormData(initialFormData)
    } catch (error) {
      if (error instanceof ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          const path = err.path.join('.')
          newErrors[path] = err.message
        })
        setErrors(newErrors)
        toast.error('Please fix the validation errors')
      } else {
        toast.error(error instanceof Error ? error.message : 'Failed to submit form')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const updateFormData = (section: keyof FicaFormData, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }))
  }

  return (
    <div className={`container mx-auto py-6 space-y-8 max-w-4xl ${belgrano.className} bg-[#fedba5] text-[#0e475f] p-8 rounded-lg`}>
      <div className="text-center space-y-2">
        <h1 className={`text-3xl font-bold tracking-tight text-[#0e475f] ${cormorant.className}`}>Client Due Diligence Form</h1>
        <p className="text-muted-foreground">
          Financial Intelligence Centre Act (FICA) - Natural Person acting on behalf of Companies and Close Corporation
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="company" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-[#f6a649]">
            <TabsTrigger value="company" className="data-[state=active]:bg-[#158279] data-[state=active]:text-white">Company Details</TabsTrigger>
            <TabsTrigger value="representative" className="data-[state=active]:bg-[#158279] data-[state=active]:text-white">Representative</TabsTrigger>
            <TabsTrigger value="service" className="data-[state=active]:bg-[#158279] data-[state=active]:text-white">Service Details</TabsTrigger>
            <TabsTrigger value="ownership" className="data-[state=active]:bg-[#158279] data-[state=active]:text-white">Ownership</TabsTrigger>
          </TabsList>

          <TabsContent value="company">
            <Card className="border-[#158279]">
              <CardHeader className="bg-[#fedba5]">
                <CardTitle className={`text-[#0e475f] ${cormorant.className}`}>Company Information</CardTitle>
                <CardDescription className="text-[#158279]">
                  Enter the company or close corporation details
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="company_legal_entity">Company Legal Entity</Label>
                  <Input 
                    id="company_legal_entity" 
                    placeholder="Enter company legal entity"
                    value={formData.companyDetails.company_legal_entity}
                    onChange={(e) => updateFormData('companyDetails', 'company_legal_entity', e.target.value)}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="company_registration_number">Company Registration Number</Label>
                  <Input 
                    id="company_registration_number" 
                    placeholder="Enter company registration number"
                    value={formData.companyDetails.company_registration_number}
                    onChange={(e) => updateFormData('companyDetails', 'company_registration_number', e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="company_sa_presence">South African Presence</Label>
                    <Textarea 
                      id="company_sa_presence" 
                      placeholder="Describe company's presence in South Africa"
                      value={formData.companyDetails.company_sa_presence}
                      onChange={(e) => updateFormData('companyDetails', 'company_sa_presence', e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company_stock_exchange">Stock Exchange Listing</Label>
                    <Input 
                      id="company_stock_exchange" 
                      placeholder="If applicable"
                      value={formData.companyDetails.company_stock_exchange}
                      onChange={(e) => updateFormData('companyDetails', 'company_stock_exchange', e.target.value)}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_tax_number">SARS Tax Number</Label>
                  <Input 
                    id="company_tax_number" 
                    placeholder="Enter tax number"
                    value={formData.companyDetails.company_tax_number}
                    onChange={(e) => updateFormData('companyDetails', 'company_tax_number', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company_physical_address">Registered Address</Label>
                  <Textarea 
                    id="company_physical_address" 
                    placeholder="Enter registered address"
                    value={formData.companyDetails.company_physical_address}
                    onChange={(e) => updateFormData('companyDetails', 'company_physical_address', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="representative">
            <Card className="border-[#158279]">
              <CardHeader className="bg-[#fedba5]">
                <CardTitle className={`text-[#0e475f] ${cormorant.className}`}>Representative Details</CardTitle>
                <CardDescription className="text-[#158279]">
                  Enter your personal details as the company representative
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="representative_full_name">Full Name</Label>
                  <Input 
                    id="representative_full_name" 
                    placeholder="Enter your full name"
                    value={formData.representativeDetails.representative_full_name}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_full_name', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative_id_number">ID/Passport Number</Label>
                  <Input 
                    id="representative_id_number" 
                    placeholder="Enter your ID/passport number"
                    value={formData.representativeDetails.representative_id_number}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_id_number', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative_physical_address">Physical Address</Label>
                  <Textarea 
                    id="representative_physical_address" 
                    placeholder="Enter your physical address"
                    value={formData.representativeDetails.representative_physical_address}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_physical_address', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative_telephone">Contact Number</Label>
                  <Input 
                    id="representative_telephone" 
                    placeholder="Enter phone number"
                    value={formData.representativeDetails.representative_telephone}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_telephone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative_email">Email Address</Label>
                  <Input 
                    id="representative_email" 
                    placeholder="Enter email address"
                    value={formData.representativeDetails.representative_email}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_email', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="representative_authority_type">Authority to Act</Label>
                  <Textarea 
                    id="representative_authority_type" 
                    placeholder="Describe your authority to act on behalf of the company"
                    value={formData.representativeDetails.representative_authority_type}
                    onChange={(e) => updateFormData('representativeDetails', 'representative_authority_type', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="service">
            <Card className="border-[#158279]">
              <CardHeader className="bg-[#fedba5]">
                <CardTitle className={`text-[#0e475f] ${cormorant.className}`}>Service Requirements</CardTitle>
                <CardDescription className="text-[#158279]">
                  Specify the services you're seeking
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-4">
                  <Label>Type of Service</Label>
                  <RadioGroup 
                    onValueChange={(value) => updateFormData('serviceInformation', 'service_type', value)}
                    value={formData.serviceInformation.service_type}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="rental" id="rental" />
                      <Label htmlFor="rental">Rental premises</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="transaction" id="transaction" />
                      <Label htmlFor="transaction">Transaction</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="other" id="other" />
                      <Label htmlFor="other">Other</Label>
                    </div>
                  </RadioGroup>
                </div>

                {formData.serviceInformation.service_type === 'other' && (
                  <div className="space-y-2">
                    <Label htmlFor="service_other_details">Other Service Details</Label>
                    <Input 
                      id="service_other_details" 
                      placeholder="Please specify"
                      value={formData.serviceInformation.service_other_details}
                      onChange={(e) => updateFormData('serviceInformation', 'service_other_details', e.target.value)}
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="payment_finance_method">Payment Financing</Label>
                  <Textarea 
                    id="payment_finance_method" 
                    placeholder="Describe how payments will be financed"
                    value={formData.serviceInformation.payment_finance_method}
                    onChange={(e) => updateFormData('serviceInformation', 'payment_finance_method', e.target.value)}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="payment_large_cash"
                    checked={formData.serviceInformation.payment_large_cash}
                    onCheckedChange={(checked) => updateFormData('serviceInformation', 'payment_large_cash', checked as boolean)}
                  />
                  <Label htmlFor="payment_large_cash">Will any payment involve R49,999 or more in cash?</Label>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="ownership">
            <Card className="border-[#158279]">
              <CardHeader className="bg-[#fedba5]">
                <CardTitle className={`text-[#0e475f] ${cormorant.className}`}>Ownership Structure</CardTitle>
                <CardDescription className="text-[#158279]">
                  Provide details about the company's ownership and control
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 bg-white">
                <div className="space-y-2">
                  <Label htmlFor="business_description">Business Description</Label>
                  <Textarea 
                    id="business_description" 
                    placeholder="Describe the company's business and industry"
                    value={formData.businessInformation.business_description}
                    onChange={(e) => updateFormData('businessInformation', 'business_description', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ownership_structure">Ownership Structure</Label>
                  <Textarea 
                    id="ownership_structure" 
                    placeholder="Describe the ownership and control structure"
                    value={formData.businessInformation.ownership_structure}
                    onChange={(e) => updateFormData('businessInformation', 'ownership_structure', e.target.value)}
                  />
                </div>

                <div className="space-y-4">
                  <Label>Ultimate Beneficial Owners Identification Method</Label>
                  <RadioGroup 
                    onValueChange={(value) => updateFormData('uboInformation', 'ubo_method', value)}
                    value={formData.uboInformation.ubo_method}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="control" id="control" />
                      <Label htmlFor="control">Control of Operations</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="majority" id="majority" />
                      <Label htmlFor="majority">Majority Ownership (25%+)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="executive" id="executive" />
                      <Label htmlFor="executive">Executive Managers</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubo_details">Beneficial Owners Details</Label>
                  <Textarea 
                    id="ubo_details" 
                    placeholder="Enter full names and ID/passport numbers"
                    value={formData.uboInformation.ubo_details}
                    onChange={(e) => updateFormData('uboInformation', 'ubo_details', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ubo_addresses">Beneficial Owners Addresses</Label>
                  <Textarea 
                    id="ubo_addresses" 
                    placeholder="Enter physical addresses of beneficial owners"
                    value={formData.uboInformation.ubo_addresses}
                    onChange={(e) => updateFormData('uboInformation', 'ubo_addresses', e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex flex-col items-center gap-4">
          <Button 
            type="submit" 
            className="w-full max-w-md bg-[#158279] hover:bg-[#0e475f] text-white" 
            size="lg"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Form'}
          </Button>
          
          <div className="flex items-center justify-center w-full mt-8">
            <img 
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Clever-Assets-Logo-cdDMdJuCx4VcH5JtDgE2fP8nKZDABQ.png" 
              alt="Clever Assets" 
              className="h-8 w-auto object-contain"
            />
          </div>
        </div>
      </form>
    </div>
  )
}
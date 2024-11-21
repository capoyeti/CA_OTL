# OTL Template Variables Guide

## Preamble (Pre-Section 1)
- {{otl_date}} - Document date
- {{landlord_company_one_name}} - First landlord company name 
- {{landlord_company_one_reg}} - First landlord registration number
- {{landlord_company_two_name}} - Second landlord company name
- {{landlord_company_two_reg}} - Second landlord registration number
- {{landlord_consortium_name}} - Consortium name
- {{landlord_trading_name}} - Trading name
- {{tenant_legal_entity}} - Legal entity name of tenant
- {{tenant_registration_number}} - Registration number of tenant
- {{tenant_trading_name}} - Trading name of tenant
- {{otl_validity_period}} - Initial validity period

## 1. Offer and Agreement
- {{otl_valid_period_number}} - Number of days offer remains valid after signature
- {{otl_valid_period_text}} - Text representation of validity period

## 2. The Property  
- {{property_erf_number}} - ERF number
- {{property_township}} - Township name
- {{property_area}} - Area name
- {{property_province}} - Province name

## 3. Premises
- {{premises_shop_number}} - Shop number identifier
- {{premises_size_sqm}} - Size in square meters
- {{premises_size_variation_percent}} - Allowable size variation percentage

## 4. Trading Date and Commencement Date
- {{trading_commencement_date}} - Trading commencement date
- {{trading_commencement_year}} - Trading commencement year
- {{lease_commencement_month}} - Lease commencement month
- {{lease_commencement_year}} - Lease commencement year

## 5. Lease Period
- {{lease_period_years}} - Duration of lease in years

## 6. Beneficial Occupation Date
- {{beneficial_occupation_period}} - Period of beneficial occupation in days
- {{fitout_start_hours}} - Hours allowed before fit-out must begin
- {{fitout_start_hours_text}} - Text representation of fit-out start hours
- {{compliance_cert_days}} - Days allowed to obtain compliance certificates
- {{compliance_cert_days_text}} - Text representation of compliance certificate days
- {{penalty_multiplier}} - Penalty multiplier for non-trading
- {{penalty_multiplier_text}} - Text representation of penalty multiplier
- {{days_in_year}} - Number of days in year for rental calculation

## 7. Installation And Fit Out
- No unique variables in this section - refers to annexures and other clauses

## 8. Incomplete Premises
- No unique variables - references other clauses

## 9. Rental
- {{monthly_rental_amount}} - Monthly rental amount in Rand
- {{annual_escalation_rate}} - Annual rental escalation percentage

## 10. Marketing
- {{marketing_contribution_percent}} - Marketing contribution percentage

## 11. Parking
- {{parking_rate_per_bay}} - Monthly rate per parking bay
- {{parking_bays_number}} - Number of parking bays
- {{parking_bays_text}} - Text representation of parking bays number
- {{parking_escalation_rate}} - Annual parking rate escalation percentage

## 12. Turnover Rental Percentage
- {{turnover_percentage}} - Turnover rental percentage
- {{turnover_payment_days}} - Days allowed for turnover rental payment
- {{turnover_payment_days_text}} - Text representation of payment days
- {{turnover_forecast_period}} - Period for turnover forecast in months
- {{turnover_forecast_period_text}} - Text representation of forecast period
- {{monthly_turnover_days}} - Days allowed for monthly turnover statement
- {{monthly_turnover_days_text}} - Text representation of monthly turnover days

## 13. Penalty for Not Trading
- {{non_trading_penalty_multiplier}} - Penalty multiplier for non-trading
- {{non_trading_penalty_multiplier_text}} - Text representation of penalty multiplier
- {{annual_days}} - Number of days in year for calculation

## 14. Premises Usage and Trading Name
- {{permitted_usage}} - Permitted business usage description
- {{trading_name}} - Trading name of tenant

## 15. Utility Costs
- No unique variables - describes metering and calculation methods

## 16. Other Costs
- {{standby_power_measurement_units}} - Units for measuring standby power usage (kWh and/or kVA)

## 17. Lease Fees
- {{lease_preparation_fee}} - Lease preparation fee amount

## 19. Deposit
- {{deposit_multiplier}} - Multiple of monthly rental required for deposit

## 26. Trading Hours
- {{trading_hours_weekday_open}} - Weekday opening time
- {{trading_hours_weekday_close}} - Weekday closing time
- {{trading_hours_friday_open}} - Friday opening time
- {{trading_hours_friday_close}} - Friday closing time
- {{trading_hours_saturday_open}} - Saturday opening time
- {{trading_hours_saturday_close}} - Saturday closing time
- {{trading_hours_sunday_open}} - Sunday opening time
- {{trading_hours_sunday_close}} - Sunday closing time

## 29. Other Offer to Lease Terms
- {{initial_deposit_months}} - Number of months' rental required for initial deposit
- {{lease_signing_days}} - Days allowed for signing standard lease
- {{lease_signing_days_text}} - Text representation of lease signing days
- {{lease_cancellation_notice_days}} - Notice days for lease cancellation
- {{occupancy_period_months}} - Months allowed for taking occupancy
- {{commission_multiplier}} - Multiple for calculating leasing commission
- {{energy_consumption_limit}} - Maximum energy consumption limit
- {{energy_hours_per_day}} - Hours per day for energy calculation
- {{energy_max_demand}} - Maximum energy demand
- {{power_factor}} - Required power factor

## 30. FICA Requirements
- {{fica_act_number}} - FICA Act number
- {{fica_act_year}} - FICA Act year
- {{fica_docs_days}} - Days allowed for FICA document submission

## 31. POPIA
- {{popia_act_number}} - POPIA Act number
- {{popia_act_year}} - POPIA Act year

## 33. Domicilium
- {{landlord_physical_address}} - Landlord's physical address
- {{landlord_email_address}} - Landlord's email address
- {{tenant_physical_address}} - Tenant's physical address
- {{tenant_email_address}} - Tenant's email address

# FICA - CDD Form Variables

## Company Details
- {{company_legal_entity}} - Company name and registration number
- {{company_registration_number}} - Company registration number
- {{company_sa_presence}} - Description of SA business presence
- {{company_stock_exchange}} - Stock exchange listing if applicable
- {{company_tax_number}} - SARS income tax number
- {{company_physical_address}} - Company's registered physical address

## Representative Details
- {{representative_full_name}} - Full name of company representative
- {{representative_id_number}} - SA ID or foreign passport number
- {{representative_physical_address}} - Physical address of representative
- {{representative_telephone}} - Contact telephone number
- {{representative_email}} - Email address
- {{representative_authority_type}} - Authority documentation type

## Service Information
- {{service_type}} - Type of service required (rental/transaction/other)
- {{service_other_details}} - Details for other service types
- {{payment_finance_method}} - Method of financing payments
- {{payment_large_cash}} - Indicator for large cash payments (Y/N)

## Business Information
- {{business_description}} - Description of company business/industry
- {{ownership_structure}} - Company ownership structure details

## UBO Information
- {{ubo_method}} - Method of UBO identification (control/majority/executive)
- {{ubo_details}} - Details of ultimate beneficial owners
- {{ubo_addresses}} - Physical addresses of UBOs

## Office Use
- {{employee_name}} - Name of processing employee
- {{employee_completion_date}} - Date of form completion
- {{outstanding_requirements}} - List of outstanding requirements

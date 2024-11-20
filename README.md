# OTL Document Management System

A modern document management system for Offer to Lease (OTL) agreements, built with Next.js, TypeScript, and Supabase.

## Overview

The OTL Document Management System streamlines the creation and management of commercial lease agreements for shopping centers and malls. The system breaks down traditional OTL documents into modular sections stored in a Supabase database, allowing for dynamic assembly and customization while maintaining standardization.

### Key Features

- 📄 Dynamic template management
- 🔄 Modular document sections
- 📝 Variable tracking for landlord and tenant information
- 🔢 Automatic section numbering and cross-referencing
- ✍️ E-signature integration
- 🏢 Integration with property management platform

## Tech Stack

- **Frontend**: Next.js 14 with TypeScript
- **Database**: Supabase
- **Styling**: Tailwind CSS
- **Authentication**: Supabase Auth
- **PDF Processing**: pdf-lib
- **E-Signatures**: (Integration pending)

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- Supabase account and project

### Installation

1. Clone the repository:
   ```bash
   git clone [repository-url]
   cd ca-otl
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
src/
├── app/             # Next.js app directory
├── components/      # Reusable UI components
├── lib/            # Utility functions and configurations
├── types/          # TypeScript type definitions
└── utils/          # Helper functions
```

## Database Schema

The system uses the following main tables in Supabase:

- `templates`: Main template definitions
- `template_sections`: Modular sections of templates
- `template_variables`: Variables used in templates
- (Additional schema details to be added)

## Contributing

1. Create a feature branch
2. Make your changes
3. Submit a pull request

## License

[License details to be added]

## Contact

[Contact information to be added]

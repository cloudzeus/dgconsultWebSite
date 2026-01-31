# DGCONSULT - Business Solutions on Demand

Εξειδικευμένες λύσεις ψηφιακού μετασχηματισμού και ανάλυσης δεδομένων για τον αγροδιατροφικό τομέα.

## 🚀 Features

- **Modern Next.js 16** with TypeScript
- **Prisma ORM** with MariaDB adapter
- **Premium UI Components** with shadcn/ui
- **GSAP Animations** for smooth interactions
- **Responsive Design** optimized for all devices
- **Contact Form** with database integration
- **Case Studies** showcase with dynamic routing

## 🛠️ Tech Stack

- **Framework**: Next.js 16.1.6
- **Language**: TypeScript
- **Database**: MariaDB (via Prisma 7)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Animations**: GSAP
- **Icons**: Lucide React

## 📦 Installation

```bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your database credentials

# Generate Prisma Client
npx prisma generate

# Seed the database
npx tsx prisma/seed.ts

# Run development server
npm run dev
```

## 🌐 Environment Variables

Create a `.env` file in the root directory:

```env
DB_URL="mysql://user:password@host:port/database"
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npx prisma generate` - Generate Prisma Client
- `npx tsx prisma/seed.ts` - Seed database

## 📧 Contact

**DGCONSULT**
- Address: Λεωφ. Κηφισού 48, Περιστέρι – 121 33
- Phone: 210 5711581
- Email: info@dgconsult.gr

## 📄 License

Copyright © 2026 DGCONSULT. All rights reserved.

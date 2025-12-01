# Supabase Integration Guide

This document explains how to set up and configure Supabase for the Wiserdome property management application.

## Overview

The Wiserdome application uses Supabase as its backend database to store:
- Contact form inquiries
- Pricing plans and features
- Services and service features
- FAQs
- Testimonials
- Cities (supported locations)
- Properties (for future property management features)

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A Supabase project created in your account
3. Node.js 18+ installed

## Setup Instructions

### Step 1: Create a Supabase Project

1. Log in to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Enter your project details:
   - **Name**: wiserdome (or your preferred name)
   - **Database Password**: Create a strong password
   - **Region**: Choose the closest region to your users
4. Click "Create new project"

### Step 2: Run the Database Schema

1. In your Supabase project, go to **SQL Editor**
2. Click "New Query"
3. Copy the contents of `supabase/schema.sql` and paste it into the editor
4. Click "Run" to execute the SQL

This will:
- Create all necessary tables
- Set up Row Level Security (RLS) policies for both anonymous and authenticated users
- Insert seed data (cities, pricing plans, services, FAQs, testimonials)
- Create triggers for automatic timestamp updates

### Step 3: Deploy to Cloudflare Pages

1. In your Cloudflare Pages dashboard, go to your project settings
2. Navigate to **Settings > Environment variables**
3. Add the following environment variables:
   - **SUPABASE_URL**: Your Supabase project URL (found in Settings > API)
   - **SUPABASE_ANON_KEY**: Your Supabase anonymous key (found in Settings > API)
4. Set the build command to: `npm run build`
5. Set the build output directory to: `/` (root directory)
6. Deploy your site

The build script will automatically generate the configuration file with your Supabase credentials.

### Step 4: Create an Admin User

1. In Supabase, go to **Authentication > Users**
2. Click "Add User"
3. Enter an email and password for your admin account
4. Click "Create User"

### Step 4: Configure the React Application

1. Navigate to the React app directory:
   ```bash
   cd react-app
   ```

2. Copy the environment example file:
   ```bash
   cp .env.example .env
   ```

3. In Supabase, go to **Settings > API**
4. Copy the following values and update your `.env` file:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public key** → `VITE_SUPABASE_ANON_KEY`

### Step 5: Install Dependencies and Run

```bash
npm install
npm run dev
```

### Step 6: Verify the Setup

1. Open http://localhost:5173 in a browser
2. Navigate to the Contact page and submit a test form
3. Check your Supabase dashboard under **Table Editor > contact_inquiries**
4. Navigate to /admin/login and sign in with your admin credentials
5. Verify you can access the admin dashboard

## React Application Structure

```
react-app/
├── src/
│   ├── components/
│   │   ├── admin/          # Admin panel components
│   │   ├── common/         # Shared components
│   │   └── layout/         # Header, Footer
│   ├── contexts/           # React contexts (Auth)
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Supabase client, data service
│   └── pages/              # Page components
├── .env.example            # Environment variables template
└── package.json
```

## Database Schema

### Tables

| Table | Description |
|-------|-------------|
| `contact_inquiries` | Stores contact form submissions |
| `pricing_plans` | Stores pricing plan information |
| `plan_features` | Stores features for each plan |
| `services` | Stores service offerings |
| `service_features` | Stores features for each service |
| `faqs` | Stores frequently asked questions |
| `testimonials` | Stores customer testimonials |
| `cities` | Stores supported cities |
| `properties` | Stores property information (future use) |

### Row Level Security (RLS)

The schema includes RLS policies that:
- Allow anonymous users to insert contact inquiries
- Allow anonymous users to read public data (pricing, services, FAQs, cities, testimonials)
- Allow authenticated (admin) users full CRUD access to all tables
- Restrict access to sensitive data for unauthenticated users

## Admin Panel

The admin panel is accessible at `/admin` and requires authentication.

### Demo Mode

When Supabase is not configured, the app runs in demo mode:
- Demo credentials: `admin@wiserdome.com` / `admin123`
- Changes will not be persisted

### Admin Features

- **Dashboard**: Overview of all content
- **Pricing Plans**: Create, edit, delete pricing plans
- **Services**: Manage service offerings
- **FAQs**: Manage frequently asked questions
- **Testimonials**: Manage customer testimonials
- **Inquiries**: View and manage contact form submissions

## Data Service API

The application provides functions for interacting with Supabase:

### Contact Inquiries

```javascript
import { submitContactInquiry } from './lib/dataService';

const result = await submitContactInquiry({
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+1234567890',
    city: 'mumbai',
    type: 'apartment',
    message: 'I need help with my property'
});
```

### Fetching Data

```javascript
import { getPricingPlans, getServices, getFAQs, getCities, getTestimonials } from './lib/dataService';

const plans = await getPricingPlans();
const services = await getServices();
const faqs = await getFAQs();
const cities = await getCities();
const testimonials = await getTestimonials();
```

## Fallback Behavior

If Supabase is not configured or unavailable, the application automatically falls back to static data defined in `src/lib/dataService.js`. This ensures the website remains functional during development or if there are connectivity issues.

## Security Considerations

1. **API Keys**: The anon key is safe to expose in browser code as it only allows access based on RLS policies
2. **RLS Policies**: All tables have RLS enabled to control data access
3. **Authentication**: Admin features require Supabase authentication
4. **Form Validation**: Always validate form inputs on both client and server side
5. **Rate Limiting**: Consider enabling rate limiting in Supabase for production

## Building for Production

### Static HTML Site (Cloudflare Pages)

```bash
# Set environment variables in Cloudflare Pages, then build
npm run build
```

The build script generates `js/env-config.js` with your Supabase credentials.

### React Application

```bash
cd react-app
npm run build
```

The built files will be in the `dist/` directory.

## Troubleshooting

### Debugging Contact Form Errors

If you see "An error occurred. Please try again." when submitting the contact form:

1. **Open Browser Developer Tools** (F12 or Right-click > Inspect)
2. **Go to the Console tab** and look for messages starting with `[Contact Form]` or `[Data Service]`
3. **Check for these common issues:**

   - **"Supabase URL and Anon Key are not configured"**
     - You need to set environment variables in Cloudflare Pages
     - Go to Cloudflare Pages > Your project > Settings > Environment variables
     - Add `SUPABASE_URL` and `SUPABASE_ANON_KEY`
     - Redeploy your site

   - **"Permission denied" or RLS policy error**
     - The Supabase RLS policies may not allow anonymous inserts
     - Check that the `contact_inquiries` table has the correct RLS policy
     - Run the SQL from `supabase/schema.sql` if you haven't already

   - **Network error or "Failed to fetch"**
     - Check your internet connection
     - Verify the Supabase URL is correct
     - Make sure your Supabase project is not paused

   - **Supabase project is paused**
     - Free-tier Supabase projects pause after 1 week of inactivity
     - Go to Supabase dashboard and resume your project

### Common Issues

1. **"Supabase is not configured" warning**
   - For Cloudflare Pages: Set environment variables in project settings
   - For local development: Run `npm run build` with environment variables set

2. **Form submission fails**
   - Check browser console for errors
   - Verify RLS policies allow inserts to `contact_inquiries`
   - Check network tab for API response

3. **Admin login fails**
   - Verify you've created a user in Supabase Authentication
   - Check that RLS policies allow authenticated user access

4. **Data not loading**
   - Verify the schema was executed successfully
   - Check RLS policies allow reads
   - Check if seed data was inserted

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)
- [React Router Documentation](https://reactrouter.com/)

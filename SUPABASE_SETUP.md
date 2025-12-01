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
- Set up Row Level Security (RLS) policies
- Insert seed data (cities, pricing plans, services, FAQs, testimonials)
- Create triggers for automatic timestamp updates

### Step 3: Configure the Application

1. In Supabase, go to **Settings > API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public key** (found under "Project API keys")

3. Open `js/supabase-config.js` and update:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### Step 4: Verify the Setup

1. Open `contact.html` in a browser
2. Submit a test contact form
3. Check your Supabase dashboard under **Table Editor > contact_inquiries**
4. You should see the form submission recorded

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
- Restrict access to sensitive data

## JavaScript API

The application provides a `WiserdomeData` object for interacting with Supabase:

### Contact Inquiries

```javascript
// Submit a contact inquiry
const result = await WiserdomeData.submitContactInquiry({
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
// Get pricing plans
const plans = await WiserdomeData.getPricingPlans();

// Get services
const services = await WiserdomeData.getServices();

// Get FAQs
const faqs = await WiserdomeData.getFAQs();

// Get cities
const cities = await WiserdomeData.getCities();

// Get testimonials
const testimonials = await WiserdomeData.getTestimonials();
```

## Fallback Behavior

If Supabase is not configured or unavailable, the application automatically falls back to static data defined in `js/data-service.js`. This ensures the website remains functional during development or if there are connectivity issues.

## Security Considerations

1. **API Keys**: The anon key is safe to expose in browser code as it only allows access based on RLS policies
2. **RLS Policies**: All tables have RLS enabled to control data access
3. **Form Validation**: Always validate form inputs on both client and server side
4. **Rate Limiting**: Consider enabling rate limiting in Supabase for production

## Troubleshooting

### Common Issues

1. **"Supabase is not configured" warning**
   - Make sure you've updated the credentials in `js/supabase-config.js`

2. **Form submission fails**
   - Check browser console for errors
   - Verify RLS policies allow inserts to `contact_inquiries`
   - Check network tab for API response

3. **Data not loading**
   - Verify the schema was executed successfully
   - Check RLS policies allow reads
   - Check if seed data was inserted

### Getting Help

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord Community](https://discord.supabase.com)

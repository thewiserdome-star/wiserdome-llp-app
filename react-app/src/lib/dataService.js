/**
 * Wiserdome Data Service
 * 
 * This module provides functions to interact with Supabase database.
 * It handles all CRUD operations for the application data.
 */

import { supabase } from './supabase';

// Constants
const SUCCESS_MESSAGE = 'Thank you! We will contact you shortly.';
const ERROR_MESSAGE = 'An error occurred. Please try again.';

// ============================================
// Contact Inquiries
// ============================================

export async function submitContactInquiry(data) {
  if (!supabase) {
    console.log('Contact form submission (Supabase not configured):', data);
    return { success: true, message: SUCCESS_MESSAGE };
  }

  try {
    const { data: result, error } = await supabase
      .from('contact_inquiries')
      .insert([{
        full_name: data.name,
        email: data.email,
        phone: data.phone,
        property_city: data.city,
        property_type: data.type,
        message: data.message
      }])
      .select();

    if (error) {
      console.error('Error submitting contact inquiry:', error);
      return { success: false, message: ERROR_MESSAGE };
    }

    return { success: true, message: SUCCESS_MESSAGE, data: result };
  } catch (err) {
    console.error('Exception submitting contact inquiry:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

// ============================================
// Pricing Plans
// ============================================

export async function getPricingPlans() {
  if (!supabase) {
    return getStaticPricingPlans();
  }

  try {
    const { data: plans, error } = await supabase
      .from('pricing_plans')
      .select(`
        *,
        plan_features (*)
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching pricing plans:', error);
      return getStaticPricingPlans();
    }

    return plans;
  } catch (err) {
    console.error('Exception fetching pricing plans:', err);
    return getStaticPricingPlans();
  }
}

// ============================================
// Services
// ============================================

export async function getServices() {
  if (!supabase) {
    return getStaticServices();
  }

  try {
    const { data: services, error } = await supabase
      .from('services')
      .select(`
        *,
        service_features (*)
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching services:', error);
      return getStaticServices();
    }

    return services;
  } catch (err) {
    console.error('Exception fetching services:', err);
    return getStaticServices();
  }
}

// ============================================
// FAQs
// ============================================

export async function getFAQs(category = null) {
  if (!supabase) {
    return getStaticFAQs();
  }

  try {
    let query = supabase
      .from('faqs')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (category) {
      query = query.eq('category', category);
    }

    const { data: faqs, error } = await query;

    if (error) {
      console.error('Error fetching FAQs:', error);
      return getStaticFAQs();
    }

    return faqs;
  } catch (err) {
    console.error('Exception fetching FAQs:', err);
    return getStaticFAQs();
  }
}

// ============================================
// Cities
// ============================================

export async function getCities() {
  if (!supabase) {
    return getStaticCities();
  }

  try {
    const { data: cities, error } = await supabase
      .from('cities')
      .select('*')
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching cities:', error);
      return getStaticCities();
    }

    return cities;
  } catch (err) {
    console.error('Exception fetching cities:', err);
    return getStaticCities();
  }
}

// ============================================
// Testimonials
// ============================================

export async function getTestimonials(featuredOnly = false) {
  if (!supabase) {
    return getStaticTestimonials();
  }

  try {
    let query = supabase
      .from('testimonials')
      .select('*')
      .eq('is_active', true);

    if (featuredOnly) {
      query = query.eq('is_featured', true);
    }

    const { data: testimonials, error } = await query;

    if (error) {
      console.error('Error fetching testimonials:', error);
      return getStaticTestimonials();
    }

    return testimonials;
  } catch (err) {
    console.error('Exception fetching testimonials:', err);
    return getStaticTestimonials();
  }
}

// ============================================
// Utility Functions
// ============================================

export function cityNameToSlug(name) {
  return name.toLowerCase().replace(/\s+/g, '-');
}

// ============================================
// Static Fallback Data
// ============================================

function getStaticPricingPlans() {
  return [
    {
      id: '1',
      name: 'Basic',
      description: 'For vacant properties',
      price_monthly: 1999,
      target_audience: 'Vacant Properties',
      is_popular: false,
      plan_features: [
        { feature_name: 'Monthly Inspections', is_included: true },
        { feature_name: 'Bill Payments', is_included: true },
        { feature_name: 'Key Management', is_included: true },
        { feature_name: 'Tenant Management', is_included: false },
        { feature_name: 'Rent Collection', is_included: false },
        { feature_name: 'Minor Repairs Coordination', is_included: false },
        { feature_name: 'Legal Support', is_included: false },
        { feature_name: 'Deep Cleaning (Annual)', is_included: false }
      ]
    },
    {
      id: '2',
      name: 'Standard',
      description: 'For rented properties',
      price_monthly: 3499,
      target_audience: 'Rented Properties',
      is_popular: true,
      plan_features: [
        { feature_name: 'Monthly Inspections', is_included: true },
        { feature_name: 'Bill Payments', is_included: true },
        { feature_name: 'Key Management', is_included: true },
        { feature_name: 'Tenant Management', is_included: true },
        { feature_name: 'Rent Collection', is_included: true },
        { feature_name: 'Minor Repairs Coordination', is_included: true },
        { feature_name: 'Legal Support', is_included: false },
        { feature_name: 'Deep Cleaning (Annual)', is_included: false }
      ]
    },
    {
      id: '3',
      name: 'Premium',
      description: 'Complete peace of mind',
      price_monthly: 5999,
      target_audience: 'Complete Care',
      is_popular: false,
      plan_features: [
        { feature_name: 'Monthly Inspections', is_included: true },
        { feature_name: 'Bill Payments', is_included: true },
        { feature_name: 'Key Management', is_included: true },
        { feature_name: 'Tenant Management', is_included: true },
        { feature_name: 'Rent Collection', is_included: true },
        { feature_name: 'Minor Repairs Coordination', is_included: true },
        { feature_name: 'Legal Support', is_included: true },
        { feature_name: 'Deep Cleaning (Annual)', is_included: true }
      ]
    }
  ];
}

function getStaticServices() {
  return [
    {
      id: '1',
      name: 'Rental Management',
      short_description: 'End-to-end tenant management',
      full_description: 'Finding the right tenant is just the beginning. We handle the entire lifecycle of tenancy.',
      icon: '🏠',
      service_features: [
        { feature_text: 'Tenant background verification & police clearance' },
        { feature_text: 'Rental agreement drafting & registration' },
        { feature_text: 'Monthly rent collection & deposit' },
        { feature_text: 'Tenant relationship management' },
        { feature_text: 'Move-in & move-out inspections' }
      ]
    },
    {
      id: '2',
      name: 'Maintenance & Repairs',
      short_description: 'Keep your property in showroom condition',
      full_description: 'We coordinate all repairs with trusted local vendors and supervise the work.',
      icon: '🔧',
      service_features: [
        { feature_text: 'Regular cleaning & deep cleaning services' },
        { feature_text: 'Plumbing, electrical, and carpentry repairs' },
        { feature_text: 'Painting and waterproofing' },
        { feature_text: 'Pest control services' },
        { feature_text: 'Appliance servicing (AC, RO, Geyser)' }
      ]
    },
    {
      id: '3',
      name: 'Legal & Documentation',
      short_description: 'Navigate Indian property laws with ease',
      full_description: 'Our legal experts ensure your property is compliant and secure.',
      icon: '📋',
      service_features: [
        { feature_text: 'Property tax payments' },
        { feature_text: 'Society maintenance bill management' },
        { feature_text: 'Khata transfer & mutation assistance' },
        { feature_text: 'Power of Attorney (PoA) coordination' },
        { feature_text: 'Legal dispute advisory' }
      ]
    },
    {
      id: '4',
      name: 'Resale & Renovation',
      short_description: 'Upgrade or sell your property',
      full_description: 'Whether you want to upgrade your home or sell it for the best price, we act as your ground team.',
      icon: '🏗️',
      service_features: [
        { feature_text: 'Full-scale home renovation supervision' },
        { feature_text: 'Interior design coordination' },
        { feature_text: 'Property valuation services' },
        { feature_text: 'Buyer search and negotiation for resale' },
        { feature_text: 'Sale deed registration support' }
      ]
    }
  ];
}

function getStaticFAQs() {
  return [
    {
      id: '1',
      question: 'Is my property safe with you?',
      answer: 'Absolutely. We conduct thorough background checks on all our staff and vendors. We also provide digital logs of every visit.',
      category: 'general'
    },
    {
      id: '2',
      question: 'How do I pay for the services?',
      answer: 'You can pay online via credit card, bank transfer, or UPI. We offer monthly, quarterly, and annual billing cycles.',
      category: 'billing'
    },
    {
      id: '3',
      question: 'Do you cover legal disputes?',
      answer: 'Our Premium plan includes basic legal advisory. For complex disputes, we can connect you with specialized property lawyers at discounted rates.',
      category: 'legal'
    },
    {
      id: '4',
      question: 'What cities do you operate in?',
      answer: 'Currently, we are active in Mumbai, Bangalore, Delhi NCR, Pune, Hyderabad, and Chennai.',
      category: 'general'
    }
  ];
}

function getStaticCities() {
  return [
    { id: '1', name: 'Mumbai', state: 'Maharashtra' },
    { id: '2', name: 'Bangalore', state: 'Karnataka' },
    { id: '3', name: 'Delhi NCR', state: 'Delhi' },
    { id: '4', name: 'Pune', state: 'Maharashtra' },
    { id: '5', name: 'Hyderabad', state: 'Telangana' },
    { id: '6', name: 'Chennai', state: 'Tamil Nadu' }
  ];
}

function getStaticTestimonials() {
  return [
    {
      id: '1',
      customer_name: 'Rajesh Kumar',
      customer_location: 'USA',
      customer_designation: 'Software Engineer',
      testimonial_text: 'Wiserdome has been managing my apartment in Mumbai for 2 years now. Excellent communication and transparency.',
      rating: 5,
      is_featured: true
    },
    {
      id: '2',
      customer_name: 'Priya Sharma',
      customer_location: 'UK',
      customer_designation: 'Doctor',
      testimonial_text: 'Finding reliable property managers in India was always a challenge. Wiserdome solved that problem completely.',
      rating: 5,
      is_featured: true
    },
    {
      id: '3',
      customer_name: 'Amit Patel',
      customer_location: 'Canada',
      customer_designation: 'Business Owner',
      testimonial_text: 'Professional service and timely updates. My property has never been in better hands.',
      rating: 4,
      is_featured: false
    }
  ];
}

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
      }]);

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
// Developer Website Inquiries
// ============================================

export async function submitDeveloperWebsiteInquiry(data) {
  if (!supabase) {
    console.log('Developer website inquiry submission (Supabase not configured):', data);
    return { success: true, message: SUCCESS_MESSAGE };
  }

  try {
    const { data: result, error } = await supabase
      .from('developer_website_inquiries')
      .insert([{
        company_name: data.companyName,
        contact_name: data.contactName,
        email: data.email,
        phone: data.phone,
        city: data.city,
        projects_per_year: data.projectsPerYear,
        current_website: data.currentWebsite,
        message: data.message
      }]);

    if (error) {
      console.error('Error submitting developer website inquiry:', error);
      return { success: false, message: ERROR_MESSAGE };
    }

    return { success: true, message: SUCCESS_MESSAGE, data: result };
  } catch (err) {
    console.error('Exception submitting developer website inquiry:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

export async function getDeveloperPackages() {
  if (!supabase) {
    return getStaticDeveloperPackages();
  }

  try {
    const { data: packages, error } = await supabase
      .from('developer_website_packages')
      .select(`
        *,
        features:developer_package_features(*)
      `)
      .eq('is_active', true)
      .order('display_order');

    if (error) {
      console.error('Error fetching developer packages:', error);
      return getStaticDeveloperPackages();
    }

    // Transform data to match UI expectation (features array of strings)
    return packages.map(pkg => ({
      ...pkg,
      // Map snake_case DB fields to camelCase UI fields
      isPopular: pkg.is_popular,
      priceLabel: pkg.price_label,
      priceNote: pkg.price_note,
      idealFor: pkg.ideal_for,
      features: pkg.features
        .sort((a, b) => a.display_order - b.display_order)
        .map(f => f.feature_text)
    }));
  } catch (err) {
    console.error('Exception fetching developer packages:', err);
    return getStaticDeveloperPackages();
  }
}

export async function saveDeveloperPackage(packageData) {
  if (!supabase) return { success: false, message: 'Supabase not configured' };

  try {
    // 1. Separate features from package data
    const { features, id, ...pkgDetails } = packageData;
    let packageId = id;

    // Generate slug if not present (simple version)
    if (!pkgDetails.slug && pkgDetails.name) {
      pkgDetails.slug = pkgDetails.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');

      // Append random string to ensure uniqueness if needed, 
      // but for now let's rely on the name being unique enough or let DB error out if duplicate
    }

    // 2. Insert or Update Package
    if (packageId) {
      // Update existing
      const { error: pkgError } = await supabase
        .from('developer_website_packages')
        .update(pkgDetails)
        .eq('id', packageId);

      if (pkgError) throw pkgError;
    } else {
      // Insert new
      const { data: newPkg, error: pkgError } = await supabase
        .from('developer_website_packages')
        .insert([pkgDetails])
        .select()
        .single();

      if (pkgError) throw pkgError;
      packageId = newPkg.id;
    }

    // 3. Handle Features
    // First, delete existing features for this package
    const { error: deleteError } = await supabase
      .from('developer_package_features')
      .delete()
      .eq('package_id', packageId);

    if (deleteError) throw deleteError;

    // Then insert new features
    if (features && features.length > 0) {
      // Parse features string if it comes from textarea (newline separated)
      const featureList = Array.isArray(features)
        ? features
        : features.split('\n').filter(f => f.trim());

      const featureRows = featureList.map((text, index) => ({
        package_id: packageId,
        feature_text: text.trim(),
        display_order: index + 1
      }));

      if (featureRows.length > 0) {
        const { error: featureError } = await supabase
          .from('developer_package_features')
          .insert(featureRows);

        if (featureError) throw featureError;
      }
    }

    return { success: true };
  } catch (error) {
    console.error('Error saving developer package:', error);
    return { success: false, message: error.message };
  }
}

export async function deleteDeveloperPackage(packageId) {
  if (!supabase) return { success: false, message: 'Supabase not configured' };

  try {
    // Features will be deleted automatically via cascade if configured, 
    // but good practice to delete them explicitly or rely on FK cascade.
    // Assuming FK cascade is NOT set up, we delete features first.

    // 1. Delete features
    const { error: featError } = await supabase
      .from('developer_package_features')
      .delete()
      .eq('package_id', packageId);

    if (featError) throw featError;

    // 2. Delete package
    const { error: pkgError } = await supabase
      .from('developer_website_packages')
      .delete()
      .eq('id', packageId);

    if (pkgError) throw pkgError;

    return { success: true };
  } catch (error) {
    console.error('Error deleting developer package:', error);
    return { success: false, message: error.message };
  }
}

function getStaticDeveloperPackages() {
  return [
    {
      id: 'starter',
      name: 'Starter Project Site',
      tagline: 'Perfect for single project launches',
      priceLabel: 'One-time from',
      price: '₹49,999',
      priceNote: '+ ₹2,999/mo hosting',
      idealFor: 'New property launches, individual project microsites, and builders testing digital marketing.',
      features: [
        'Single project landing page',
        'Project overview & highlights',
        'Interactive location map',
        'Image gallery with lightbox',
        'Lead capture form with email alerts',
        'Basic analytics dashboard',
        'Mobile-responsive design',
        'SSL security certificate'
      ],
      isPopular: false
    },
    {
      id: 'growth',
      name: 'Growth Multi-Project Site',
      tagline: 'Scale your digital presence',
      priceLabel: 'One-time from',
      price: '₹1,49,999',
      priceNote: '+ ₹5,999/mo hosting',
      idealFor: 'Growing developers with multiple ongoing projects who need a centralized digital hub.',
      features: [
        'Multi-project pages (up to 10)',
        'Property listing grid with filters',
        'Blog/news section for updates',
        'Advanced SEO setup & optimization',
        'CRM/lead integration hooks',
        'Virtual tour embedding',
        'Social media integration',
        'Priority email support'
      ],
      isPopular: true
    },
    {
      id: 'enterprise',
      name: 'Enterprise Developer Suite',
      tagline: 'Complete digital transformation',
      priceLabel: 'Custom pricing from',
      price: '₹3,99,999',
      priceNote: '+ custom hosting SLA',
      idealFor: 'Large developers and builders with multi-city portfolios requiring enterprise-grade solutions.',
      features: [
        'Custom design system & branding',
        'Unlimited project pages',
        'Multi-city portfolio management',
        'CRM & marketing tool integrations',
        'Dedicated account manager',
        'SLA-backed hosting (99.9% uptime)',
        '24/7 priority support',
        'Advanced analytics & reporting'
      ],
      isPopular: false
    }
  ];
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

// ============================================
// Property Owner Functions
// ============================================

/**
 * Submit a property owner signup request
 */
export async function submitOwnerSignup(data) {
  if (!supabase) {
    console.log('Owner signup submission (Supabase not configured):', data);
    return { success: true, message: 'Thank you for signing up! Your request is pending approval.' };
  }

  try {
    const { data: result, error } = await supabase
      .from('property_owners')
      .insert([{
        full_name: data.fullName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        city: data.city,
        country: data.country || 'India',
        status: 'pending'
      }]);

    if (error) {
      console.error('Error submitting owner signup:', error);
      if (error.code === '23505') {
        return { success: false, message: 'An account with this email already exists.' };
      }
      return { success: false, message: ERROR_MESSAGE };
    }

    return { success: true, message: 'Thank you for signing up! Your request is pending approval.', data: result };
  } catch (err) {
    console.error('Exception submitting owner signup:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

/**
 * Get all property owner signup requests (admin only)
 */
export async function getPropertyOwners(status = null) {
  if (!supabase) {
    return getStaticPropertyOwners();
  }

  try {
    let query = supabase
      .from('property_owners')
      .select('*')
      .order('created_at', { ascending: false });

    if (status) {
      query = query.eq('status', status);
    }

    const { data: owners, error } = await query;

    if (error) {
      console.error('Error fetching property owners:', error);
      return getStaticPropertyOwners();
    }

    return owners;
  } catch (err) {
    console.error('Exception fetching property owners:', err);
    return getStaticPropertyOwners();
  }
}

/**
 * Update property owner status (admin only)
 */
export async function updateOwnerStatus(ownerId, status, rejectionReason = null) {
  if (!supabase) {
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    const updateData = {
      status,
      ...(status === 'rejected' && rejectionReason ? { rejection_reason: rejectionReason } : {}),
      ...(status === 'approved' ? { approved_at: new Date().toISOString() } : {})
    };

    const { error } = await supabase
      .from('property_owners')
      .update(updateData)
      .eq('id', ownerId);

    if (error) {
      console.error('Error updating owner status:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception updating owner status:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

/**
 * Get owner by email (for login verification)
 */
export async function getOwnerByEmail(email) {
  if (!supabase) {
    return null;
  }

  if (!email) {
    return null;
  }

  try {
    // Trim email and use exact match
    // Use maybeSingle() instead of single() to avoid PGRST116 error when no row found
    const trimmedEmail = email.trim();
    
    const { data: owner, error } = await supabase
      .from('property_owners')
      .select('*')
      .eq('email', trimmedEmail)
      .maybeSingle();

    if (error) {
      console.error('Error fetching owner by email:', error);
      return null;
    }

    // maybeSingle() returns null when no row is found (not an error)
    return owner;
  } catch (err) {
    console.error('Exception fetching owner by email:', err);
    return null;
  }
}

/**
 * Get properties for a specific owner
 */
export async function getOwnerProperties(ownerId) {
  if (!supabase) {
    return getStaticOwnerProperties();
  }

  try {
    const { data: properties, error } = await supabase
      .from('owner_properties')
      .select('*')
      .eq('owner_id', ownerId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching owner properties:', error);
      return getStaticOwnerProperties();
    }

    return properties;
  } catch (err) {
    console.error('Exception fetching owner properties:', err);
    return getStaticOwnerProperties();
  }
}

/**
 * Get all properties with owner info (admin only)
 */
export async function getAllOwnerProperties() {
  if (!supabase) {
    return [];
  }

  try {
    const { data: properties, error } = await supabase
      .from('owner_properties')
      .select(`
        *,
        owner:property_owners(id, full_name, email, phone)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching all owner properties:', error);
      return [];
    }

    return properties;
  } catch (err) {
    console.error('Exception fetching all owner properties:', err);
    return [];
  }
}

/**
 * Add a property for an owner (admin only)
 */
export async function addOwnerProperty(propertyData) {
  if (!supabase) {
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    const { data: result, error } = await supabase
      .from('owner_properties')
      .insert([{
        owner_id: propertyData.ownerId,
        property_name: propertyData.propertyName,
        property_type: propertyData.propertyType,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        pincode: propertyData.pincode,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        area_sqft: propertyData.areaSqft,
        is_rented: propertyData.isRented || false,
        monthly_rent: propertyData.monthlyRent,
        tenant_name: propertyData.tenantName,
        tenant_phone: propertyData.tenantPhone,
        management_plan: propertyData.managementPlan,
        management_start_date: propertyData.managementStartDate,
        notes: propertyData.notes,
        status: propertyData.status || 'active'
      }])
      .select()
      .single();

    if (error) {
      console.error('Error adding owner property:', error);
      return { success: false, message: error.message };
    }

    return { success: true, data: result };
  } catch (err) {
    console.error('Exception adding owner property:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

/**
 * Update a property (admin only)
 */
export async function updateOwnerProperty(propertyId, propertyData) {
  if (!supabase) {
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('owner_properties')
      .update({
        property_name: propertyData.propertyName,
        property_type: propertyData.propertyType,
        address: propertyData.address,
        city: propertyData.city,
        state: propertyData.state,
        pincode: propertyData.pincode,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        area_sqft: propertyData.areaSqft,
        is_rented: propertyData.isRented,
        monthly_rent: propertyData.monthlyRent,
        tenant_name: propertyData.tenantName,
        tenant_phone: propertyData.tenantPhone,
        management_plan: propertyData.managementPlan,
        management_start_date: propertyData.managementStartDate,
        notes: propertyData.notes,
        status: propertyData.status
      })
      .eq('id', propertyId);

    if (error) {
      console.error('Error updating owner property:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception updating owner property:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

/**
 * Delete a property (admin only)
 */
export async function deleteOwnerProperty(propertyId) {
  if (!supabase) {
    return { success: false, message: 'Supabase not configured' };
  }

  try {
    const { error } = await supabase
      .from('owner_properties')
      .delete()
      .eq('id', propertyId);

    if (error) {
      console.error('Error deleting owner property:', error);
      return { success: false, message: error.message };
    }

    return { success: true };
  } catch (err) {
    console.error('Exception deleting owner property:', err);
    return { success: false, message: ERROR_MESSAGE };
  }
}

// Static fallback data for property owners
function getStaticPropertyOwners() {
  return [
    {
      id: '1',
      full_name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1-555-0123',
      city: 'Mumbai',
      status: 'pending',
      created_at: new Date().toISOString()
    },
    {
      id: '2',
      full_name: 'Sarah Johnson',
      email: 'sarah.j@example.com',
      phone: '+1-555-0456',
      city: 'Bangalore',
      status: 'approved',
      created_at: new Date().toISOString()
    }
  ];
}

// Static fallback data for owner properties
function getStaticOwnerProperties() {
  return [
    {
      id: '1',
      property_name: 'Sea View Apartment',
      property_type: 'apartment',
      address: '123 Marine Drive',
      city: 'Mumbai',
      bedrooms: 3,
      bathrooms: 2,
      area_sqft: 1500,
      is_rented: true,
      monthly_rent: 45000,
      management_plan: 'standard',
      status: 'active'
    }
  ];
}

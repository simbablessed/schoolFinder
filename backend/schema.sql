-- ==============================================================================
-- School Finder Zimbabwe - Neon PostgreSQL Database Schema
-- Compatible with Neon Serverless Postgres & Cloudflare Workers
-- ==============================================================================

-- Enable UUID extension if not already present
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SCHOOLS TABLE
CREATE TABLE IF NOT EXISTS schools (
    id VARCHAR(64) PRIMARY KEY, -- slug-style ID, e.g. 'prince-edward', 'arundel'
    name VARCHAR(255) NOT NULL,
    province VARCHAR(100) NOT NULL,
    location VARCHAR(255) NOT NULL,
    type VARCHAR(100) NOT NULL, -- e.g. 'Boys High & Boarding', 'Girls College & Boarding'
    curriculum TEXT[] NOT NULL DEFAULT '{}', -- e.g. ARRAY['ZIMSEC', 'Cambridge']
    starting_fees INTEGER NOT NULL DEFAULT 500, -- in USD per term
    pass_rate INTEGER NOT NULL DEFAULT 80, -- percentage
    rating NUMERIC(3, 2) NOT NULL DEFAULT 4.0,
    reviews_count INTEGER NOT NULL DEFAULT 0,
    photo VARCHAR(255) NOT NULL, -- photo ID or image URL
    motto VARCHAR(255),
    phone VARCHAR(50),
    email VARCHAR(100),
    website VARCHAR(255),
    description TEXT,
    facilities TEXT[] NOT NULL DEFAULT '{}',
    is_featured BOOLEAN NOT NULL DEFAULT false,
    verified BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. USERS & PROFILES TABLE (Linked with Clerk & Temp Credentials)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(128) PRIMARY KEY, -- Clerk user_xxx ID or 'user_admin_princeedward'
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('parent', 'school', 'admin', 'guest')),
    school_id VARCHAR(64) REFERENCES schools(id) ON DELETE SET NULL,
    phone VARCHAR(50),
    avatar VARCHAR(255),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. ADMISSION ENQUIRIES / APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id VARCHAR(64) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    parent_name VARCHAR(255) NOT NULL,
    parent_email VARCHAR(255) NOT NULL,
    parent_phone VARCHAR(50),
    interest VARCHAR(255) NOT NULL, -- e.g. 'Form 1 (2027) Day Scholar'
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Interview', 'Enrolled', 'Declined')),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. REVIEWS & RATINGS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    school_id VARCHAR(64) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    user_id VARCHAR(128) REFERENCES users(id) ON DELETE SET NULL,
    author VARCHAR(255) NOT NULL,
    role VARCHAR(100) NOT NULL, -- e.g. 'Parent of Form 4 Student', 'Alumni (Class of 2021)'
    rating SMALLINT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255) NOT NULL,
    comment TEXT NOT NULL,
    verified BOOLEAN NOT NULL DEFAULT true,
    helpful_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. PARENT SAVED SCHOOLS (WISHLIST) TABLE
CREATE TABLE IF NOT EXISTS saved_schools (
    user_email VARCHAR(255) NOT NULL,
    school_id VARCHAR(64) NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (user_email, school_id)
);

-- 6. INDEXES FOR LIGHTNING FAST QUERIES (Cloudflare Edge Cache Friendly)
CREATE INDEX IF NOT EXISTS idx_schools_province ON schools(province);
CREATE INDEX IF NOT EXISTS idx_schools_fees ON schools(starting_fees);
CREATE INDEX IF NOT EXISTS idx_schools_pass_rate ON schools(pass_rate);
CREATE INDEX IF NOT EXISTS idx_schools_rating ON schools(rating);
CREATE INDEX IF NOT EXISTS idx_enquiries_school ON enquiries(school_id);
CREATE INDEX IF NOT EXISTS idx_enquiries_parent_email ON enquiries(parent_email);
CREATE INDEX IF NOT EXISTS idx_reviews_school ON reviews(school_id);
CREATE INDEX IF NOT EXISTS idx_saved_user_email ON saved_schools(user_email);

-- Trigger to auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

DROP TRIGGER IF EXISTS set_schools_updated_at ON schools;
CREATE TRIGGER set_schools_updated_at
BEFORE UPDATE ON schools
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS set_enquiries_updated_at ON enquiries;
CREATE TRIGGER set_enquiries_updated_at
BEFORE UPDATE ON enquiries
FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create admin users table
CREATE TABLE IF NOT EXISTS admin_users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL DEFAULT 'admin',
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create site settings table
CREATE TABLE IF NOT EXISTS site_settings (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    favicon VARCHAR(255) DEFAULT '/favicon.ico',
    meta_description TEXT,
    meta_keywords TEXT,
    social_title VARCHAR(255),
    social_image VARCHAR(255),
    header_snippet TEXT,
    footer_snippet TEXT,
    analytics_code TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create RFQ submissions table
CREATE TABLE IF NOT EXISTS rfq_submissions (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    industry VARCHAR(100),
    urgency VARCHAR(50),
    project_description TEXT NOT NULL,
    additional_comments TEXT,
    language VARCHAR(5) DEFAULT 'az',
    files JSONB DEFAULT '[]',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create images table
CREATE TABLE IF NOT EXISTS site_images (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    original_name VARCHAR(255) NOT NULL,
    url VARCHAR(500) NOT NULL,
    alt_text VARCHAR(255),
    category VARCHAR(100), -- hero, about, services, etc.
    size INTEGER,
    mime_type VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create content table for multilingual text
CREATE TABLE IF NOT EXISTS site_content (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL,
    content_az TEXT,
    content_en TEXT,
    content_ru TEXT,
    category VARCHAR(50), -- navigation, hero, about, services, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(key)
);

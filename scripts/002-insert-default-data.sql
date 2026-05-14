-- Insert default admin user (password: admin123)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ')
ON CONFLICT (username) DO NOTHING;

-- Insert default site settings
INSERT INTO site_settings (
    title, 
    meta_description, 
    meta_keywords, 
    social_title, 
    social_image
) VALUES (
    'Supply Base Azerbaijan - Procurement as a Service',
    'Supply Base Azerbaijan provides comprehensive procurement and supply chain solutions for various industries. Professional sourcing, quality assurance, and reliable delivery services.',
    'procurement, supply chain, Azerbaijan, sourcing, industrial supplies, construction materials, oil gas equipment',
    'Supply Base Azerbaijan - Satınalma və Təchizat Xidməti',
    '/images/sba-logo.webp'
) ON CONFLICT DO NOTHING;

-- Insert default content
INSERT INTO site_content (key, content_az, content_en, content_ru, category) VALUES
-- Navigation
('nav_about', 'Haqqımızda', 'About', 'О нас', 'navigation'),
('nav_services', 'Xidmətlər', 'Services', 'Услуги', 'navigation'),
('nav_contact', 'Əlaqə', 'Contact', 'Контакты', 'navigation'),
('nav_get_quote', 'Təklif al', 'Get Quote', 'Получить предложение', 'navigation'),
('nav_faq', 'FAQ', 'FAQ', 'FAQ', 'navigation'),

-- Header
('header_tagline', 'Satınalma və Təchizat Xidməti', 'Procurement as a Service', 'Закупки и поставки как услуга', 'header'),
('header_phone', 'Telefon', 'Phone', 'Телефон', 'header'),

-- Hero Section
('hero_title', 'Sizin', 'Your', 'Ваше', 'hero'),
('hero_title_highlight', 'Satınalma və Təchizat', 'Procurement and', 'Решение Закупок', 'hero'),
('hero_title_end', 'Xidməti Həlli', 'Supply Service Solution', 'и Поставок', 'hero'),
('hero_subtitle', 'Supply Base Azerbaijan müxtəlif sənaye sahələrindən olan şirkətlərə və fərdlərə fasiləsiz biznes fəaliyyəti üçün təchizat zənciri ehtiyaclarını ödəməkdə kömək edən hərtərəfli tədarük şirkətidir.', 'Supply Base Azerbaijan is a comprehensive supply company helping companies and individuals from various industries achieve and fulfill their supply chain needs for uninterrupted business activities.', 'Supply Base Azerbaijan - это комплексная компания поставок, помогающая компаниям и частным лицам из различных отраслей достигать и выполнять свои потребности в цепи поставок для непрерывной деловой активности.', 'hero'),

-- About Section
('about_badge', 'Supply Base Azerbaijan Haqqında', 'About Supply Base Azerbaijan', 'О Supply Base Azerbaijan', 'about'),
('about_title', 'Sizin Etibarlı Tədarük Tərəfdaşınız', 'Your Trusted Procurement Partner', 'Ваш Надежный Партнер по Закупкам', 'about'),
('about_subtitle', 'Biz hərtərəfli tədarük həlləri üzrə ixtisaslaşmışıq və biznes əməliyyatlarınızı təmin etmək üçün "Satınalma və Təchizat Xidməti" təminatçısı kimi fəaliyyət göstəririk. Sorğularınızı bizə göndərin, komandamız ən qısa vaxtda təkliflərlə sizə geri dönsün.', 'We specialize in comprehensive supply solutions and operate as a "Procurement and Supply Service" provider to ensure your business operations. Send us your requests, let our team get back to you with offers in the shortest time.', 'Мы специализируемся на комплексных решениях поставок и работаем как поставщик "Закупки и Поставки как услуга" для обеспечения ваших бизнес-операций. Отправьте нам ваши запросы, пусть наша команда вернется к вам с предложениями в кратчайшие сроки.', 'about')

ON CONFLICT (key) DO NOTHING;

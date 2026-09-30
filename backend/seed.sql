-- ==============================================================================
-- School Finder Zimbabwe - Neon Database Initial Seed
-- Pre-populates Zimbabwe institutions, reviews, enquiries & temp auth accounts
-- ==============================================================================

-- 1. INSERT SCHOOLS
INSERT INTO schools (
    id, name, province, location, type, curriculum, starting_fees, pass_rate,
    rating, reviews_count, photo, motto, phone, email, website, description, facilities, is_featured
) VALUES
(
    'prince-edward',
    'Prince Edward School',
    'Harare',
    'Harare Central, Harare',
    'Boys High & Boarding',
    ARRAY['ZIMSEC', 'Cambridge'],
    1250,
    96,
    4.8,
    142,
    'photo-1541829070764-84a7d30dd3f3',
    'Tot Facienda Parum Factum (So much to do, so little done)',
    '+263 242 790 600',
    'admin@princeedward.co.zw',
    'https://princeedward.co.zw',
    'Founded in 1898, Prince Edward School is one of Zimbabwe''s most prestigious government high schools for boys, renowned for supreme academic standards, competitive rugby, cricket, music academy and deep heritage.',
    ARRAY['Olympic Pool', 'Science Labs', 'Library', 'Rugby Field', 'Hostels', 'Auditorium', 'Tennis Courts'],
    true
),
(
    'arundel',
    'Arundel School',
    'Harare',
    'Mount Pleasant, Harare',
    'Girls College & Boarding',
    ARRAY['Cambridge'],
    2800,
    98,
    4.9,
    98,
    'photo-1580582932707-520aed937b7b',
    'Gratia et Veritas (Grace and Truth)',
    '+263 242 334 322',
    'admin@arundel.co.zw',
    'https://arundel.ac.zw',
    'A premier independent boarding and day school for girls offering internationally acclaimed Cambridge IGCSE and A-Level curricula, exceptional creative arts, and holistic empowerment.',
    ARRAY['Art Studios', 'Squash Courts', 'Music School', 'Science Pavilion', 'Boarding Houses', 'Chapel'],
    true
),
(
    'peterhouse',
    'Peterhouse Boys',
    'Mashonaland East',
    'Marondera, Mashonaland East',
    'Independent Boarding College',
    ARRAY['Cambridge'],
    3400,
    94,
    4.7,
    115,
    'photo-1562774053-701939374585',
    'Conditur in Petra (Founded upon the Rock)',
    '+263 65 232 4200',
    'admin@peterhouse.co.zw',
    'https://peterhousegroup.co.zw',
    'One of Southern Africa''s top independent Anglican boarding schools nestled on expansive grounds in Marondera, championing character, rowing, Duke of Edinburgh awards, and global university placement.',
    ARRAY['Estate Grounds', 'Rowing Club', 'Sanatorium', 'Chapel', 'Physics Centre', 'Design & Tech Lab'],
    true
),
(
    'st-georges',
    'St. George''s College',
    'Harare',
    'Borrowdale, Harare',
    'Boys Catholic High School',
    ARRAY['Cambridge'],
    2500,
    97,
    4.8,
    130,
    'photo-1523050854058-8df90110c9f1',
    'Ex Fide Fiducia (From Faith comes Confidence)',
    '+263 242 704 064',
    'admin@stgeorges.co.zw',
    'https://stgeorges.co.zw',
    'Founded in 1896 by Jesuit missionaries, St George''s College provides disciplined Catholic leadership formation, stellar STEM achievements, and proud sporting traditions in Harare.',
    ARRAY['Jesuit Chapel', 'Sports Pavilion', 'Computer Science Lab', 'Robotics Club', 'Swimming Pool'],
    false
),
(
    'dominican-convent',
    'Dominican Convent High School',
    'Harare',
    'Harare Central, Harare',
    'Girls Catholic High School',
    ARRAY['Cambridge', 'ZIMSEC'],
    1100,
    99,
    4.9,
    168,
    'photo-1592280771190-3e2e4d571952',
    'Veritas (Truth)',
    '+263 242 790 600',
    'admin@convent.co.zw',
    'https://conventharare.co.zw',
    'Consistently leading Zimbabwe in national Ordinary and Advanced Level pass rates, Dominican Convent Harare fosters intellectual rigor, ethics, and female leadership.',
    ARRAY['Science Laboratories', 'ICT Centre', 'Choir Hall', 'Netball Courts', 'Modern Library'],
    false
),
(
    'cbc',
    'Christian Brothers College',
    'Bulawayo',
    'Matsheumhlope, Bulawayo',
    'Boys Catholic High School',
    ARRAY['Cambridge'],
    1950,
    93,
    4.6,
    84,
    'photo-1509062522246-3755977927d7',
    'Facere et Docere (To Do and to Teach)',
    '+263 29 228 1234',
    'admin@cbc.co.zw',
    'https://cbcbulawayo.co.zw',
    'Matabeleland''s premier boys college fostering academic excellence, swimming championships, and Christian brotherhood in the tranquil suburb of Matsheumhlope, Bulawayo.',
    ARRAY['Olympic Pool', 'Cricket Oval', 'Auditorium', 'Science Complex', 'Hostels'],
    false
),
(
    'falcon',
    'Falcon College',
    'Matabeleland South',
    'Esigodini, Matabeleland South',
    'Independent Boarding College',
    ARRAY['Cambridge'],
    3600,
    92,
    4.7,
    76,
    'photo-1546410531-bb4caa6b424d',
    'Sic Itur Ad Astra (Such is the path to the stars)',
    '+263 86 7700 4010',
    'admin@falconcollege.biz',
    'https://falconcollege.com',
    'Set within a vast private wilderness game park near Bulawayo, Falcon College is celebrated for rugged leadership, conservation, horse riding, and stellar Cambridge curricula.',
    ARRAY['Wildlife Park', 'Equestrian Centre', 'Air Strip', 'Rugby Grounds', 'Boarding Houses'],
    false
),
(
    'petra-college',
    'Petra College',
    'Bulawayo',
    'Luveve Road, Bulawayo',
    'Co-ed Christian School',
    ARRAY['Cambridge'],
    1400,
    91,
    4.5,
    62,
    'photo-1577495508048-b635879837f1',
    'Firm Foundation',
    '+263 29 224 5678',
    'admin@petracollege.co.zw',
    'https://petracollege.ac.zw',
    'A nurturing co-educational Christian school in Bulawayo offering holistic Cambridge schooling from early childhood through to A-Levels.',
    ARRAY['Computer Lab', 'Soccer Field', 'Hall', 'Music Room', 'Art Room'],
    false
),
(
    'gateway',
    'Gateway High School',
    'Harare',
    'Emerald Hill, Harare',
    'Co-ed Christian High School',
    ARRAY['Cambridge'],
    1600,
    95,
    4.7,
    89,
    'photo-1510531704581-5b2870972060',
    'Enter to Learn, Go Forth to Serve',
    '+263 242 308 000',
    'admin@gatewayhigh.co.zw',
    'https://gatewayschools.ac.zw',
    'Known for strong Christian values, expansive modern facilities in Emerald Hill, and high tertiary acceptance rates worldwide.',
    ARRAY['Performing Arts Centre', 'Modern Laboratories', 'Sports Fields', 'Basketball Courts'],
    false
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    starting_fees = EXCLUDED.starting_fees,
    pass_rate = EXCLUDED.pass_rate,
    rating = EXCLUDED.rating,
    reviews_count = EXCLUDED.reviews_count;

-- 2. INSERT DEMO USERS (School Admins & Parents)
INSERT INTO users (id, email, name, role, school_id, avatar) VALUES
(
    'usr_admin_princeedward',
    'admin@princeedward.co.zw',
    'Prince Edward Admissions',
    'school',
    'prince-edward',
    'photo-1599305445671-ac291c95aaa9'
),
(
    'usr_admin_arundel',
    'admin@arundel.co.zw',
    'Arundel School Administration',
    'school',
    'arundel',
    'photo-1580582932707-520aed937b7b'
),
(
    'usr_admin_peterhouse',
    'admin@peterhouse.co.zw',
    'Peterhouse Bursar & Admissions',
    'school',
    'peterhouse',
    'photo-1562774053-701939374585'
),
(
    'usr_admin_stgeorges',
    'admin@stgeorges.co.zw',
    'St. George''s College Office',
    'school',
    'st-georges',
    'photo-1523050854058-8df90110c9f1'
),
(
    'usr_parent_tendai',
    'tendai.moyo@gmail.com',
    'Tendai Moyo',
    'parent',
    NULL,
    'photo-1614023342667-6f060e9d1e04'
),
(
    'usr_parent_demo',
    'parent@demo.co.zw',
    'Tendai Moyo (Demo Parent)',
    'parent',
    NULL,
    'photo-1500648767791-00dcc994a43e'
),
(
    'usr_parent_chipo',
    'chipo.ncube@zimfamily.co.zw',
    'Chipo Ncube',
    'parent',
    NULL,
    'photo-1534528741775-53994a69daeb'
)
ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    name = EXCLUDED.name,
    role = EXCLUDED.role;

-- 3. INSERT SAMPLE ADMISSION ENQUIRIES
INSERT INTO enquiries (school_id, parent_name, parent_email, parent_phone, interest, status, notes) VALUES
(
    'prince-edward',
    'Chipo Ncube',
    'chipo.n@gmail.com',
    '+263 77 212 3456',
    'Form 1 Admission (2027)',
    'New',
    'Requesting boarding house fees schedule and entrance assessment dates.'
),
(
    'prince-edward',
    'Farai Dube',
    'farai.dube@zimcorp.co.zw',
    '+263 71 890 1234',
    'Boarding House Vacancies',
    'Contacted',
    'Emailed boarding master questionnaire and medical declaration.'
),
(
    'prince-edward',
    'Rutendo Sibanda',
    'r.sibanda@yahoo.co.uk',
    '+263 77 567 8901',
    'Fees & Sports Bursary Scheme',
    'Interview',
    'Scheduled candidate rugby trial and academic aptitude session for Friday.'
),
(
    'prince-edward',
    'Blessing Chikowore',
    'bchikowore@hotmail.com',
    '+263 78 345 6789',
    'Cambridge A-Level Sciences',
    'Enrolled',
    'Enrolment deposit and registration documentation validated.'
),
(
    'arundel',
    'Tariro Mutasa',
    'tariro.m@gmail.com',
    '+263 77 333 4455',
    'Form 1 Day Scholar & Music Bursary',
    'New',
    'Inquiring about cello lessons and orchestral scholarship auditions.'
);

-- 4. INSERT REVIEWS
INSERT INTO reviews (school_id, author, role, rating, title, comment, verified, helpful_count) VALUES
(
    'prince-edward',
    'Dr. T. Mutasa',
    'Parent of Form 4 Student',
    5,
    'Superb rugby coaching and disciplined staff',
    'Our son thrived academically and in the First XV team. The teachers are dedicated and maintain strict disciplinary standards while supporting boys personally.',
    true,
    28
),
(
    'prince-edward',
    'T. Gumbo',
    'Alumni (Class of 2021)',
    5,
    'Proud Old Boy — unmatched brotherhood',
    'PE teaches you character, grit, and unity. The chapel services and house system instill pride you carry for life.',
    true,
    19
),
(
    'arundel',
    'Mrs. E. Sithole',
    'Parent of Form 2 Scholar',
    5,
    'World-class arts and empowering environment',
    'Arundel provides exceptional creative expression alongside Cambridge rigor. The campus is immaculate.',
    true,
    34
);

-- 5. INSERT INITIAL PARENT SAVED SCHOOLS
INSERT INTO saved_schools (user_email, school_id) VALUES
('tendai.moyo@gmail.com', 'prince-edward'),
('tendai.moyo@gmail.com', 'arundel'),
('parent@demo.co.zw', 'prince-edward'),
('parent@demo.co.zw', 'st-georges')
ON CONFLICT DO NOTHING;

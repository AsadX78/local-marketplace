-- ============================================
-- SEED CATEGORIES (Top-level + subcategories)
-- ============================================

-- Insert top-level categories
INSERT INTO public.categories (name, slug, icon, sort_order) VALUES
('{"en": "Electronics", "pcm": "Electronic", "yo": "Ẹ̀rọ̀ Ìgbàsọ́", "ha": "Kayan Lantarki", "ig": "Ngwaọrụ Eletrik"}', 'electronics', 'smartphone', 1),
('{"en": "Vehicles", "pcm": "Motor", "yo": "Ọkọ̀", "ha": "Motoci", "ig": "Ụgbọala"}', 'vehicles', 'car', 2),
('{"en": "Fashion & Beauty", "pcm": "Fashion", "yo": "Aṣọ & Ẹwà", "ha": "Kayan Ado", "ig": "Uwe & Mma"}', 'fashion', 'shirt', 3),
('{"en": "Home & Garden", "pcm": "House tins", "yo": "Ilé & Ọgbà", "ha": "Gida da Lambu", "ig": "Ụlọ & Ugbo"}', 'home', 'home', 4),
('{"en": "Property", "pcm": "Land & House", "yo": "Ohun ìní", "ha": "Kadarori", "ig": "Ihe Onwunwe"}', 'property', 'building', 5),
('{"en": "Jobs", "pcm": "Work", "yo": "Iṣẹ́", "ha": "Ayyuka", "ig": "Ọrụ"}', 'jobs', 'briefcase', 6),
('{"en": "Services", "pcm": "Service", "yo": "Iṣẹ́", "ha": "Ayyuka", "ig": "Ọrụ"}', 'services', 'wrench', 7),
('{"en": "Agriculture & Food", "pcm": "Farm", "yo": "Ìgbìnòde", "ha": "Noma da Abinci", "ig": "Ọrụ Ugbo"}', 'agriculture', 'leaf', 8),
('{"en": "Books & Media", "pcm": "Book", "yo": "Iwé & Médíà", "ha": "Littattafai", "ig": "Akwụkwọ"}', 'books', 'book', 9),
('{"en": "Sports & Fitness", "pcm": "Sport", "yo": "Eré ìdárayá", "ha": "Wasanni", "ig": "Egwuregwu"}', 'sports', 'dumbbell', 10),
('{"en": "Babies & Kids", "pcm": "Pikin tins", "yo": "Ọmọ & Ọdọ́", "ha": "Yara", "ig": "Ụmụaka"}', 'babies', 'baby', 11),
('{"en": "Pets & Animals", "pcm": "Pet", "yo": "Ẹranko", "ha": "Dabbobi", "ig": "Anụ Ufie"}', 'pets', 'paw-print', 12),
('{"en": "Business & Industrial", "pcm": "Bizness", "yo": "Òwò & Iṣẹ́", "ha": "Kasuwanci", "ig": "Azụmahịa"}', 'business', 'factory', 13),
('{"en": "Collectibles & Art", "pcm": "Art", "yo": "Àṣà & Ọ̀nà", "ha": "Kayan Tarihi", "ig": "Ihe Ochie"}', 'collectibles', 'palette', 14),
('{"en": "Tickets & Vouchers", "pcm": "Ticket", "yo": "Tíkẹ́ẹ̀tì", "ha": "Tikiti", "ig": "Tiketi"}', 'tickets', 'ticket', 15),
('{"en": "Health & Pharmacy", "pcm": "Health", "yo": "Ìlera", "ha": "Lafiya", "ig": "Ahụike"}', 'health', 'heart-pulse', 16),
('{"en": "Other", "pcm": "Oda tins", "yo": "Òmíràn", "ha": "Sauran", "ig": "Ndị Ọzọ"}', 'other', 'more-horizontal', 17)
ON CONFLICT (slug) DO NOTHING;

-- Insert subcategories
INSERT INTO public.categories (name, slug, parent_id, icon, sort_order)
SELECT
  v.name::jsonb, v.slug, c.id, 'tag', row_number() OVER (PARTITION BY c.id)
FROM (
  VALUES
    ('electronics', '{"en": "Phones & Tablets", "pcm": "Phone & Tablet", "yo": "Foonu & Tabuleti", "ha": "Wayoyi da Allunan", "ig": "Ekwentị & Mbadamba"}', 'phones-tablets'),
    ('electronics', '{"en": "Computers & Accessories", "pcm": "Computer & tins", "yo": "Kọ̀mpútà", "ha": "Kwamfuta", "ig": "Kọmpụta"}', 'computers'),
    ('electronics', '{"en": "TV & Audio", "pcm": "TV & Audio", "yo": "TV & Ohùn", "ha": "TV da Karatu", "ig": "TV & Ọdịyo"}', 'tv-audio'),
    ('electronics', '{"en": "Cameras", "pcm": "Kamera", "yo": "Kámẹ́rà", "ha": "Kyamara", "ig": "Kamera"}', 'cameras'),
    ('electronics', '{"en": "Gaming", "pcm": "Game", "yo": "Eré", "ha": "Wasanni", "ig": "Egwuregwu"}', 'gaming'),
    ('vehicles', '{"en": "Cars", "pcm": "Car", "yo": "Ọkọ̀ ayọ́kẹ́lẹ́", "ha": "Mota", "ig": "Ụgbọala"}', 'cars'),
    ('vehicles', '{"en": "Motorcycles", "pcm": "Bike", "yo": "Alùpùpù", "ha": "Babur", "ig": "bike"}', 'motorcycles'),
    ('vehicles', '{"en": "Trucks & Buses", "pcm": "Truck & Bus", "yo": "Ọkọ̀ nla", "ha": "Trekta", "ig": "Ụgbọala Nnukwu"}', 'trucks'),
    ('vehicles', '{"en": "Spare Parts", "pcm": "Spare part", "yo": "Ẹ̀yà ọkọ̀", "ha": "Kayan Motoci", "ig": "Akụkụ Ụgbọala"}', 'spare-parts'),
    ('vehicles', '{"en": "Boats & Marine", "pcm": "Boat", "yo": "Ọkọ̀ omi", "ha": "Jiragen Ruwa", "ig": "Ụgbọ Mmiri"}', 'boats'),
    ('fashion', '{"en": "Men''s Clothing", "pcm": "Man cloth", "yo": "Aṣọ ọkùnrin", "ha": "Tufafin Maza", "ig": "Uwe Nwoke"}', 'men-clothing'),
    ('fashion', '{"en": "Women''s Clothing", "pcm": "Woman cloth", "yo": "Aṣọ obìnrin", "ha": "Tufafin Mata", "ig": "Uwe Nwanyị"}', 'women-clothing'),
    ('fashion', '{"en": "Shoes & Bags", "pcm": "Shoe & Bag", "yo": "Bàtà & Apo", "ha": "Takalma da Jaka", "ig": "Akpụkpọ ụkwụ & Akpa"}', 'shoes'),
    ('fashion', '{"en": "Jewelry & Watches", "pcm": "Jewelry", "yo": "Ọṣụ̀n", "ha": "Kayan Ado", "ig": "Ọla"}', 'jewelry'),
    ('fashion', '{"en": "Beauty & Cosmetics", "pcm": "Makeup", "yo": "Ẹwà", "ha": "Kwalliya", "ig": "Mma"}', 'beauty'),
    ('home', '{"en": "Furniture", "pcm": "Furniture", "yo": "Ohun èlò ilé", "ha": "Kayan Gida", "ig": "Ngwá Ụlọ"}', 'furniture'),
    ('home', '{"en": "Appliances", "pcm": "Machine", "yo": "Ẹ̀rọ̀ ilé", "ha": "Na''urori", "ig": "Ngwa Ụlọ"}', 'appliances'),
    ('home', '{"en": "Kitchen & Dining", "pcm": "Kitchen", "yo": "Ilé ìdáná", "ha": "Wurin Dafa Abinci", "ig": "Kichin"}', 'kitchen'),
    ('home', '{"en": "Home Decor", "pcm": "Decor", "yo": "Ọṣọ́n ilé", "ha": "Kayan Gida", "ig": "Ihe Eji Achọ Ụlọ Mma"}', 'decor'),
    ('home', '{"en": "Garden & Outdoor", "pcm": "Garden", "yo": "Ọgbà", "ha": "Lambu", "ig": "Ugbo"}', 'garden'),
    ('property', '{"en": "For Sale", "pcm": "For sale", "yo": "Fún títà", "ha": "Sayarwa", "ig": "Maka Ahịa"}', 'for-sale'),
    ('property', '{"en": "For Rent", "pcm": "For rent", "yo": "Fún yíyá", "ha": "Haya", "ig": "Maka Gbaziri"}', 'for-rent'),
    ('property', '{"en": "Land & Plots", "pcm": "Land", "yo": "Ilẹ̀", "ha": "Filaye", "ig": "Ala"}', 'land'),
    ('property', '{"en": "Shortlet & Airbnb", "pcm": "Shortlet", "yo": "Ìbáṣọ́ kúkúrú", "ha": "Hayar Dan Lokaci", "ig": "Ntụgharị Dịmkpiri"}', 'shortlet'),
    ('jobs', '{"en": "Full Time", "pcm": "Full time", "yo": "Àkókò kíkún", "ha": "Cikakken Lokaci", "ig": "Oge Nzu"}', 'full-time'),
    ('jobs', '{"en": "Part Time", "pcm": "Part time", "yo": "Àkókò pípọ́", "ha": "Rage Lokaci", "ig": "Oge Obere"}', 'part-time'),
    ('jobs', '{"en": "Freelance", "pcm": "Freelance", "yo": "Òmìnira", "ha": "Kyauta", "ig": "Onwe"}', 'freelance'),
    ('jobs', '{"en": "Domestic & Care", "pcm": "House work", "yo": "Iṣẹ́ ilé", "ha": "Kula da Gida", "ig": "Ọrụ Ụlọ"}', 'domestic'),
    ('services', '{"en": "Repairs & Maintenance", "pcm": "Repair", "yo": "Àtúnṣe", "ha": "Gyara", "ig": "Ndozi"}', 'repairs'),
    ('services', '{"en": "Education & Training", "pcm": "Lesson", "yo": "Ẹ̀kọ́", "ha": "Ilimi", "ig": "Nkuzi"}', 'education'),
    ('services', '{"en": "Health & Wellness", "pcm": "Health", "yo": "Ìlera", "ha": "Lafiya", "ig": "Ahụike"}', 'health-svc'),
    ('services', '{"en": "Events & Catering", "pcm": "Event", "yo": "Ìṣẹ̀lẹ̀", "ha": "Bukuku", "ig": "Ihe Omume"}', 'events'),
    ('services', '{"en": "Professional", "pcm": "Pro", "yo": "Ọjọ̀gbọ́n", "ha": "Kwararre", "ig": "Ọkachamara"}', 'professional'),
    ('agriculture', '{"en": "Crops & Produce", "pcm": "Crop", "yo": "Ọ̀gbìn", "ha": "Amfanin Gona", "ig": "Mkpụrụ"}', 'crops'),
    ('agriculture', '{"en": "Livestock", "pcm": "Animal", "yo": "Ẹran", "ha": "Dabbobi", "ig": "Anụ"}', 'livestock'),
    ('agriculture', '{"en": "Farm Equipment", "pcm": "Farm machine", "yo": "Ẹ̀rọ̀ oko", "ha": "Kayan Noma", "ig": "Ngwa Ọrụ Ugbo"}', 'farm-equipment'),
    ('agriculture', '{"en": "Food & Beverages", "pcm": "Food", "yo": "Oúnjẹ́", "ha": "Abinci", "ig": "Nri"}', 'food-beverage'),
    ('books', '{"en": "Textbooks", "pcm": "School book", "yo": "Iwé ẹ̀kọ́", "ha": "Littattafan Karatu", "ig": "Akwụkwọ Ọmụmụ"}', 'textbooks'),
    ('books', '{"en": "Novels & Fiction", "pcm": "Story book", "yo": "Ìtàn", "ha": "Labarai", "ig": "Akụkọ"}', 'novels'),
    ('books', '{"en": "Music & Movies", "pcm": "Music", "yo": "Orin & Fíìmù", "ha": "Maki da Fina-Finai", "ig": "Egwu & Ihe Nkiri"}', 'music'),
    ('sports', '{"en": "Equipment", "pcm": "Sport tins", "yo": "Ohun èlò eré", "ha": "Kayan Wasanni", "ig": "Ngwa Egwuregwu"}', 'sport-equipment'),
    ('sports', '{"en": "Bicycles", "pcm": "Bicycle", "yo": "Kẹ̀kẹ́", "ha": "Bisaikila", "ig": "Kekị"}', 'bicycles'),
    ('sports', '{"en": "Gym & Fitness", "pcm": "Gym", "yo": "Ilé-idaraya", "ha": "Gym", "ig": "Ulo Egwuregwu"}', 'gym'),
    ('babies', '{"en": "Kids Clothing", "pcm": "Pikin cloth", "yo": "Aṣọ ọmọ", "ha": "Tufafin Yara", "ig": "Uwe Ụmụaka"}', 'kids-clothing'),
    ('babies', '{"en": "Toys & Games", "pcm": "Toy", "yo": "Eré", "ha": "Wasanni", "ig": "Egwuregwu"}', 'toys'),
    ('babies', '{"en": "Strollers & Gear", "pcm": "Pikin gear", "yo": "Ohun èlò ọmọ", "ha": "Kayan Yara", "ig": "Ngwa Ụmụaka"}', 'strollers'),
    ('pets', '{"en": "Dogs", "pcm": "Dog", "yo": "Ajá", "ha": "Kare", "ig": "Nkịta"}', 'dogs'),
    ('pets', '{"en": "Cats", "pcm": "Cat", "yo": "Ọ̀sìn", "ha": "Kyanwa", "ig": "Nwamba"}', 'cats'),
    ('pets', '{"en": "Birds & Fish", "pcm": "Bird", "yo": "Ẹyẹ", "ha": "Tsuntsaye", "ig": "Nnụnụ"}', 'birds'),
    ('business', '{"en": "Equipment & Machinery", "pcm": "Machine", "yo": "Ẹ̀rọ̀", "ha": "Na''urori", "ig": "Ngwa"}', 'biz-equipment'),
    ('business', '{"en": "Office & Commercial", "pcm": "Office", "yo": "Ọfiisi", "ha": "Ofis", "ig": "Ọfịs"}', 'office'),
    ('business', '{"en": "Raw Materials", "pcm": "Raw material", "yo": "Ohun èlò àkọ́kọ́", "ha": "Kayan Gona", "ig": "Ihe Maka"}', 'raw-materials'),
    ('collectibles', '{"en": "Art & Paintings", "pcm": "Art", "yo": "Awòrán", "ha": "Zane-zane", "ig": "Ihe Osise"}', 'art'),
    ('collectibles', '{"en": "Antiques", "pcm": "Old tins", "yo": "Àtijọ́", "ha": "Tsoffin Abubuwa", "ig": "Ihe Ochie"}', 'antiques'),
    ('collectibles', '{"en": "Coins & Stamps", "pcm": "Coin", "yo": "Ọwó́ àtijọ́", "ha": "Tsabar Kudi", "ig": "Ego Ochie"}', 'coins'),
    ('tickets', '{"en": "Event Tickets", "pcm": "Event ticket", "yo": "Tíkẹ́ẹ̀tì ìṣẹ̀lẹ̀", "ha": "Tikitin Biki", "ig": "Tiketi Ihe Omume"}', 'event-tickets'),
    ('tickets', '{"en": "Travel & Flights", "pcm": "Travel", "yo": "Ìrìn àjò", "ha": "Tafiya", "ig": "Njem"}', 'travel'),
    ('tickets', '{"en": "Gift Cards", "pcm": "Gift card", "yo": "Káàdì ẹ̀bùn", "ha": "Katin Kyauta", "ig": "Kaadị Onyinye"}', 'gift-cards'),
    ('health', '{"en": "Medicine", "pcm": "Medicine", "yo": "Oògùn", "ha": "Maganin", "ig": "Ọgwụ"}', 'medicine'),
    ('health', '{"en": "Supplements", "pcm": "Supplement", "yo": "Àfikún", "ha": "Kariya", "ig": "Mgbakwunye"}', 'supplements'),
    ('health', '{"en": "Medical Equipment", "pcm": "Medical tins", "yo": "Ẹ̀rọ̀ ìlera", "ha": "Kayan Lafiya", "ig": "Ngwa Ahụike"}', 'medical-equipment'),
    ('other', '{"en": "Miscellaneous", "pcm": "Misc", "yo": "Àdàlùdó", "ha": "Sauran", "ig": "Dị Iche Iche"}', 'misc')
) AS v(parent_slug, name, slug)
JOIN public.categories c ON c.slug = v.parent_slug
ON CONFLICT (slug) DO NOTHING;

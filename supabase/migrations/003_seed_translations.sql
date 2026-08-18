-- ============================================
-- SEED TRANSLATIONS (UI strings)
-- Languages: en, pcm, yo, ha, ig
-- ============================================

INSERT INTO public.translations (language_code, key, value) VALUES
-- Navigation
('en', 'nav.home', 'Home'), ('pcm', 'nav.home', 'Haus'), ('yo', 'nav.home', 'Ilé'), ('ha', 'nav.home', 'Gida'), ('ig', 'nav.home', 'Ulo'),
('en', 'nav.browse', 'Browse'), ('pcm', 'nav.browse', 'Luk'), ('yo', 'nav.browse', 'Wò'), ('ha', 'nav.browse', 'Duba'), ('ig', 'nav.browse', 'Lekwasị'),
('en', 'nav.sell', 'Sell'), ('pcm', 'nav.sell', 'Sell'), ('yo', 'nav.sell', 'Ta'), ('ha', 'nav.sell', 'Sayar'), ('ig', 'nav.sell', 'Ree'),
('en', 'nav.chat', 'Messages'), ('pcm', 'nav.chat', 'Message'), ('yo', 'nav.chat', 'Ìránṣẹ́'), ('ha', 'nav.chat', 'Saƙonni'), ('ig', 'nav.chat', 'Ozi'),
('en', 'nav.profile', 'Profile'), ('pcm', 'nav.profile', 'Profile'), ('yo', 'nav.profile', 'Profaili'), ('ha', 'nav.profile', 'Bayan Kai'), ('ig', 'nav.profile', 'Profaịlụ'),
('en', 'nav.login', 'Login'), ('pcm', 'nav.login', 'Login'), ('yo', 'nav.login', 'Wọlé'), ('ha', 'nav.login', 'Shiga'), ('ig', 'nav.login', 'Banye'),
('en', 'nav.logout', 'Logout'), ('pcm', 'nav.logout', 'Comot'), ('yo', 'nav.logout', 'Jáde'), ('ha', 'nav.logout', 'Fita'), ('ig', 'nav.logout', 'Pụọ'),

-- Common
('en', 'common.search', 'Search'), ('pcm', 'common.search', 'Sarch'), ('yo', 'common.search', 'Wa'), ('ha', 'common.search', 'Bincika'), ('ig', 'common.search', 'Chọọ'),
('en', 'common.filter', 'Filter'), ('pcm', 'common.filter', 'Filter'), ('yo', 'common.filter', 'Sọ́ńṣọ́'), ('ha', 'common.filter', 'Tace'), ('ig', 'common.filter', 'Nzacha'),
('en', 'common.price', 'Price'), ('pcm', 'common.price', 'Price'), ('yo', 'common.price', 'Iye owó'), ('ha', 'common.price', 'Farashi'), ('ig', 'common.price', 'Ọnụahịa'),
('en', 'common.location', 'Location'), ('pcm', 'common.location', 'Wia'), ('yo', 'common.location', 'Ibì'), ('ha', 'common.location', 'Wuri'), ('ig', 'common.location', 'Ebe'),
('en', 'common.category', 'Category'), ('pcm', 'common.category', 'Katigori'), ('yo', 'common.category', 'Ẹ̀ka'), ('ha', 'common.category', 'Nau''i'), ('ig', 'common.category', 'Otu'),
('en', 'common.posted', 'Posted'), ('pcm', 'common.posted', 'Post'), ('yo', 'common.posted', 'Tẹ̀'), ('ha', 'common.posted', 'An buga'), ('ig', 'common.posted', 'Ebibiri'),
('en', 'common.views', 'views'), ('pcm', 'common.views', 'view'), ('yo', 'common.views', 'ìwò'), ('ha', 'common.views', 'kallo'), ('ig', 'common.views', 'elele'),
('en', 'common.loading', 'Loading...'), ('pcm', 'common.loading', 'Dey load...'), ('yo', 'common.loading', 'Ń ṣiṣẹ́...'), ('ha', 'common.loading', 'Ana loda...'), ('ig', 'common.loading', 'Na-ebu...'),
('en', 'common.noResults', 'No results found'), ('pcm', 'common.noResults', 'We no see anytin'), ('yo', 'common.noResults', 'A kò rí nǹkan'), ('ha', 'common.noResults', 'Babu sakamako'), ('ig', 'common.noResults', 'Ahụghị ihe ọ bụla'),
('en', 'common.contact', 'Contact Seller'), ('pcm', 'common.contact', 'Kontact Seller'), ('yo', 'common.contact', 'Kàn sí olùtajà'), ('ha', 'common.contact', 'Tuntubi Mai Saya'), ('ig', 'common.contact', 'Kpọtụrụ Onye Reere'),

-- Listing
('en', 'listing.create', 'Create Listing'), ('pcm', 'listing.create', 'Put Listing'), ('yo', 'listing.create', 'Ṣẹ̀dá ìpolówó'), ('ha', 'listing.create', 'Ƙirƙiri Saya'), ('ig', 'listing.create', 'Mepụta Ndepụta'),
('en', 'listing.title', 'Title'), ('pcm', 'listing.title', 'Title'), ('yo', 'listing.title', 'Àkọlé'), ('ha', 'listing.title', 'Taken'), ('ig', 'listing.title', 'Aha'),
('en', 'listing.description', 'Description'), ('pcm', 'listing.description', 'Describe am'), ('yo', 'listing.description', 'Àpèjúwe'), ('ha', 'listing.description', 'Bayanin'), ('ig', 'listing.description', 'Nkọwa'),
('en', 'listing.images', 'Images'), ('pcm', 'listing.images', 'Pics'), ('yo', 'listing.images', 'Àwọn àwòrán'), ('ha', 'listing.images', 'Hotuna'), ('ig', 'listing.images', 'Onyonyo'),
('en', 'listing.priceNegotiable', 'Price Negotiable'), ('pcm', 'listing.priceNegotiable', 'Price fit tok'), ('yo', 'listing.priceNegotiable', 'Iye owó lè yípadà'), ('ha', 'listing.priceNegotiable', 'Farashi Ana Tattaunawa'), ('ig', 'listing.priceNegotiable', 'Enwere Mkparịta Ọnụahịa'),
('en', 'listing.contactForPrice', 'Contact for Price'), ('pcm', 'listing.contactForPrice', 'Kontact for price'), ('yo', 'listing.contactForPrice', 'Kàn sí fún iye owó'), ('ha', 'listing.contactForPrice', 'Tuntubi Don Farashi'), ('ig', 'listing.contactForPrice', 'Kpọtụrụ Maka Ọnụahịa'),
('en', 'listing.pendingApproval', 'Pending Admin Approval'), ('pcm', 'listing.pendingApproval', 'Dey wait Oga approve'), ('yo', 'listing.pendingApproval', 'Ń dúró fún ìfọwọ́sí'), ('ha', 'listing.pendingApproval', 'Jiran Amincewar Admin'), ('ig', 'listing.pendingApproval', 'Na-eche Nkwado Admin'),
('en', 'listing.sold', 'Sold'), ('pcm', 'listing.sold', 'Don sell'), ('yo', 'listing.sold', 'Ti ta'), ('ha', 'listing.sold', 'An sayar'), ('ig', 'listing.sold', 'Ererela'),

-- Auth
('en', 'auth.loginTitle', 'Welcome Back'), ('pcm', 'auth.loginTitle', 'Wetin dey happen'), ('yo', 'auth.loginTitle', 'Ẹ kú àbò'), ('ha', 'auth.loginTitle', 'Barka da Zuwa'), ('ig', 'auth.loginTitle', 'Nnọọ'),
('en', 'auth.registerTitle', 'Create Account'), ('pcm', 'auth.registerTitle', 'Open Account'), ('yo', 'auth.registerTitle', 'Ṣí àkàǹrò'), ('ha', 'auth.registerTitle', 'Bu Account'), ('ig', 'auth.registerTitle', 'Mepụta Akaụntụ'),
('en', 'auth.email', 'Email'), ('pcm', 'auth.email', 'Email'), ('yo', 'auth.email', 'Ìméélì'), ('ha', 'auth.email', 'Imel'), ('ig', 'auth.email', 'Email'),
('en', 'auth.password', 'Password'), ('pcm', 'auth.password', 'Password'), ('yo', 'auth.password', 'Ọ̀rọ̀ìpamọ́'), ('ha', 'auth.password', 'Kalmar shiga'), ('ig', 'auth.password', 'Okwuntughe'),
('en', 'auth.fullName', 'Full Name'), ('pcm', 'auth.fullName', 'Yor name'), ('yo', 'auth.fullName', 'Orúkọ ìnagijẹ'), ('ha', 'auth.fullName', 'Cikakken Suna'), ('ig', 'auth.fullName', 'Aha Zuru Ezu'),
('en', 'auth.phone', 'Phone Number'), ('pcm', 'auth.phone', 'Phone'), ('yo', 'auth.phone', 'Nọ́mbà fóònù'), ('ha', 'auth.phone', 'Lambar Wayar'), ('ig', 'auth.phone', 'Nọmba Ekwentị'),
('en', 'auth.googleLogin', 'Continue with Google'), ('pcm', 'auth.googleLogin', 'Use Google'), ('yo', 'auth.googleLogin', 'Lo Google'), ('ha', 'auth.googleLogin', 'Shiga da Google'), ('ig', 'auth.googleLogin', 'Jiri Google'),

-- Chat
('en', 'chat.title', 'Messages'), ('pcm', 'chat.title', 'Message'), ('yo', 'chat.title', 'Ìránṣẹ́'), ('ha', 'chat.title', 'Saƙonni'), ('ig', 'chat.title', 'Ozi'),
('en', 'chat.typeHere', 'Type a message...'), ('pcm', 'chat.typeHere', 'Write something...'), ('yo', 'chat.typeHere', 'Kọ nǹkan...'), ('ha', 'chat.typeHere', 'Rubuta wani abu...'), ('ig', 'chat.typeHere', 'Dee ihe...'),
('en', 'chat.send', 'Send'), ('pcm', 'chat.send', 'Send'), ('yo', 'chat.send', 'Fi ránṣẹ́'), ('ha', 'chat.send', 'Aika'), ('ig', 'chat.send', 'Ziga'),

-- Payment
('en', 'payment.checkout', 'Checkout'), ('pcm', 'payment.checkout', 'Pay now'), ('yo', 'payment.checkout', 'Sanwó'), ('ha', 'payment.checkout', 'Biya'), ('ig', 'payment.checkout', 'Kwụọ Ụgwọ'),
('en', 'payment.commission', 'Platform fee (5%)'), ('pcm', 'payment.commission', 'Platform chop 5%'), ('yo', 'payment.commission', 'Ọwó pátákò (5%)'), ('ha', 'payment.commission', 'Kudin Dandali (5%)'), ('ig', 'payment.commission', 'Ụgwọ Ngwá (5%)'),
('en', 'payment.total', 'Total'), ('pcm', 'payment.total', 'All'), ('yo', 'payment.total', 'Lápápọ̀'), ('ha', 'payment.total', 'Jimilla'), ('ig', 'payment.total', 'Ngụkọta'),
('en', 'payment.escrow', 'Funds held in escrow'), ('pcm', 'payment.escrow', 'Money dey safe'), ('yo', 'payment.escrow', 'Owó wà lábó'), ('ha', 'payment.escrow', 'Kudin Ana Tsare'), ('ig', 'payment.escrow', 'Ejiri ego nchekwa'),

-- Reviews
('en', 'review.title', 'Reviews'), ('pcm', 'review.title', 'Wetin dem tok'), ('yo', 'review.title', 'Àyẹ̀wò'), ('ha', 'review.title', 'Bayanai'), ('ig', 'review.title', 'Ntụle'),
('en', 'review.writeReview', 'Write a Review'), ('pcm', 'review.writeReview', 'Rate am'), ('yo', 'review.writeReview', 'Kọ àyẹ̀wò'), ('ha', 'review.writeReview', 'Rubuta Bayani'), ('ig', 'review.writeReview', 'Dee Ntụle'),
('en', 'review.rating', 'Rating'), ('pcm', 'review.rating', 'Star'), ('yo', 'review.rating', 'Ìtẹ̀lé'), ('ha', 'review.rating', 'Kimantawa'), ('ig', 'review.rating', 'Ogo'),

-- Admin
('en', 'admin.dashboard', 'Admin Dashboard'), ('pcm', 'admin.dashboard', 'Admin Panel'), ('yo', 'admin.dashboard', 'Àtòjọ Admin'), ('ha', 'admin.dashboard', 'Allon Admin'), ('ig', 'admin.dashboard', 'Oche Njikwa'),
('en', 'admin.pendingListings', 'Pending Listings'), ('pcm', 'admin.pendingListings', 'Listing wey dey wait'), ('yo', 'admin.pendingListings', 'Ìpolówó tó dúró'), ('ha', 'admin.pendingListings', 'Sayayen Jira'), ('ig', 'admin.pendingListings', 'Ndepụta Na-eche'),
('en', 'admin.approve', 'Approve'), ('pcm', 'admin.approve', 'Approve'), ('yo', 'admin.approve', 'Fọwọ́sí'), ('ha', 'admin.approve', 'Amince'), ('ig', 'admin.approve', 'Kwado'),
('en', 'admin.reject', 'Reject'), ('pcm', 'admin.reject', 'Reject'), ('yo', 'admin.reject', 'Kọ̀'), ('ha', 'admin.reject', 'Ki'), ('ig', 'admin.reject', 'Jụ'),
('en', 'admin.users', 'Users'), ('pcm', 'admin.users', 'Users'), ('yo', 'admin.users', 'Àwọn òǹjà'), ('ha', 'admin.users', 'Masu Amfani'), ('ig', 'admin.users', 'Ndị Ọrụ'),
('en', 'admin.reports', 'Reports'), ('pcm', 'admin.reports', 'Reports'), ('yo', 'admin.reports', 'Ìròyìn'), ('ha', 'admin.reports', 'Rahotanni'), ('ig', 'admin.reports', 'Akụkọ'),

-- Footer
('en', 'footer.about', 'About Us'), ('pcm', 'footer.about', 'About Us'), ('yo', 'footer.about', 'Nípa Wa'), ('ha', 'footer.about', 'Game Da Mu'), ('ig', 'footer.about', 'Banyere Anyị'),
('en', 'footer.terms', 'Terms of Service'), ('pcm', 'footer.terms', 'Terms'), ('yo', 'footer.terms', 'Ìlànà'), ('ha', 'footer.terms', 'Sharatun'), ('ig', 'footer.terms', 'Usoro'),
('en', 'footer.privacy', 'Privacy Policy'), ('pcm', 'footer.privacy', 'Privacy'), ('yo', 'footer.privacy', 'Ìṣọ̀kan'), ('ha', 'footer.privacy', 'Tsarin Sirri'), ('ig', 'footer.privacy', 'Iwu Nzuzo'),
('en', 'footer.contact', 'Contact'), ('pcm', 'footer.contact', 'Kontact'), ('yo', 'footer.contact', 'Kàn sí'), ('ha', 'footer.contact', 'Tuntubi'), ('ig', 'footer.contact', 'Kpọtụrụ'),
('en', 'footer.copyright', '© 2026 LocalMarket NG. All rights reserved.'), ('pcm', 'footer.copyright', '© 2026 LocalMarket NG. Na our own.'), ('yo', 'footer.copyright', '© 2026 LocalMarket NG. Ẹ̀tọ́ gbogbo wà.'), ('ha', 'footer.copyright', '© 2026 LocalMarket NG. Duk hakki namu ne.'), ('ig', 'footer.copyright', '© 2026 LocalMarket NG. Ikike niile edebere.')

ON CONFLICT (language_code, key) DO NOTHING;



const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

let Product;
try {
  Product = require(path.join(__dirname, 'src', 'models', 'Product.js'));
} catch (e1) {
  try {
    Product = require(path.join(__dirname, 'models', 'Product.js'));
  } catch (e2) {
    console.error('Could not load Product model.');
    process.exit(1);
  }
}

const products = [

  // ═══════════ SHOES (12) ═══════════
  { name: 'Nike Air Max 270', description: 'Premium running shoes with Max Air cushioning for all-day comfort. Lightweight mesh upper with durable rubber outsole.', category: 'Shoes', price: 150, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a7243917f52.jpg' },
  { name: 'Adidas Ultraboost 22', description: 'High-performance running shoes with responsive Boost midsole technology. Breathable Primeknit upper and Continental rubber outsole.', category: 'Shoes', price: 189.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd07bd8a128b.jpg' },
  { name: 'Classic White Sneakers', description: 'Timeless white leather sneakers with clean minimalist design. Padded collar and cushioned insole for everyday comfort.', category: 'Shoes', price: 89.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6492ad845b73.jpg' },
  { name: 'Trail Running Shoes Pro', description: 'Off-road trail running shoes with aggressive grip and waterproof membrane. Built for rugged terrain and all weather conditions.', category: 'Shoes', price: 135, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/14fcfd384db1.png' },
  { name: 'Leather Chelsea Boots', description: 'Premium full-grain leather Chelsea boots with elastic side panels. Sleek silhouette perfect for casual and semi-formal occasions.', category: 'Shoes', price: 175, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eca0f5b66143.png' },
  { name: 'Canvas Slip-On Shoes', description: 'Lightweight canvas slip-on shoes with elastic gore panels. Breathable cotton canvas upper and vulcanized rubber sole.', category: 'Shoes', price: 49.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9ab7ef638839.jpg' },
  { name: 'Basketball High Tops', description: 'Professional basketball shoes with high-top ankle support and responsive cushioning. Non-marking rubber outsole for court grip.', category: 'Shoes', price: 129.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/82b920213907.jpg' },
  { name: 'Hiking Boots Waterproof', description: 'Waterproof hiking boots with Vibram outsole and Gore-Tex membrane. Ankle support and shock absorption for long trails.', category: 'Shoes', price: 165, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5a9d29bdb1ea.jpg' },
  { name: 'Formal Oxford Shoes', description: 'Classic Oxford dress shoes in polished leather with cap-toe design. Leather sole and cushioned footbed for all-day wear.', category: 'Shoes', price: 199.99, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9b07456a6ea6.jpg' },
  { name: 'Running Shoes Lightweight', description: 'Ultra-lightweight racing flats with carbon fiber plate. Engineered mesh upper and responsive foam for speed workouts.', category: 'Shoes', price: 159.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0d7647e669d4.jpg' },
  { name: 'Suede Desert Boots', description: 'Suede desert boots with crepe rubber sole and two-eyelet lacing. Casual heritage style with ankle-high shaft.', category: 'Shoes', price: 95, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/63a2270dddae.jpg' },
  { name: 'Skate Shoes Street', description: 'Durable skate shoes with reinforced ollie area and impact-resistant insole. Cup sole design with herringbone tread pattern.', category: 'Shoes', price: 74.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ff70920bbf99.jpg' },

  // ═══════════ ELECTRONICS (12) ═══════════
  { name: 'iPhone 15 Pro Max', description: 'Latest flagship smartphone with A17 Pro chip, titanium design, and advanced camera system. 256GB storage with 5G connectivity.', category: 'Electronics', price: 1199, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9027393b23aa.jpeg' },
  { name: 'MacBook Air M3', description: 'Ultra-thin laptop with M3 chip, 15-hour battery life, and Liquid Retina display. 512GB SSD, 8GB unified memory.', category: 'Electronics', price: 1299, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c98c88106792.jpg' },
  { name: 'Sony WH-1000XM5', description: 'Premium wireless noise-canceling headphones with 30-hour battery. Adaptive sound control and multipoint connection.', category: 'Electronics', price: 349.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ffb4b33417bb.jpg' },
  { name: 'Samsung Galaxy Tab S9', description: 'Android tablet with 11-inch AMOLED display and Snapdragon 8 Gen 2. S Pen included with 128GB storage.', category: 'Electronics', price: 799.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cf5f5d19cf6b.jpg' },
  { name: 'Apple Watch Ultra 2', description: 'Rugged smartwatch with titanium case and precision dual-frequency GPS. 36-hour battery with dive computer functionality.', category: 'Electronics', price: 799, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6f2b8ebe402d.jpg' },
  { name: 'Nintendo Switch OLED', description: 'Gaming console with 7-inch OLED screen, enhanced audio, and 64GB storage. Dock with wired LAN port included.', category: 'Electronics', price: 349.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/21310fd399f5.jpg' },
  { name: 'Canon EOS R6 Mark II', description: 'Full-frame mirrorless camera with 24.2MP sensor and 4K 60fps video. In-body stabilization and dual card slots.', category: 'Electronics', price: 2499, stock: 8, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d25137e18476.jpg' },
  { name: 'JBL Charge 5 Speaker', description: 'Portable Bluetooth speaker with IP67 waterproof rating and 20-hour battery. JBL Pro Sound with built-in powerbank.', category: 'Electronics', price: 179.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/df12213fc78c.jpg' },
  { name: 'Logitech MX Master 3S', description: 'Ergonomic wireless mouse with 8K DPI sensor and quiet clicks. MagSpeed scroll wheel and multi-device support.', category: 'Electronics', price: 99.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cd7c0f48f078.jpg' },
  { name: 'DJI Mini 4 Pro Drone', description: 'Compact drone with 4K HDR video and 34-minute flight time. ActiveTrack 360 and obstacle sensing in all directions.', category: 'Electronics', price: 759, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/459b4619f9e9.jpg' },
  { name: 'Kindle Paperwhite 2024', description: 'E-reader with 6.8-inch display, adjustable warm light, and 16GB storage. IPX8 waterproof with 10-week battery.', category: 'Electronics', price: 149.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2b3bc70c8edd.png' },
  { name: 'GoPro Hero 12 Black', description: 'Action camera with 5.3K video and HyperSmooth 6.0 stabilization. Waterproof to 33ft with Bluetooth audio support.', category: 'Electronics', price: 399.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/19fb4eab457d.jpg' },

  // ═══════════ BAGS (12) ═══════════
  { name: 'Leather Backpack Classic', description: 'Full-grain leather backpack with padded laptop compartment. Multiple organizer pockets and adjustable shoulder straps.', category: 'Bags', price: 129.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1480a075f69f.jpg' },
  { name: 'Canvas Tote Bag', description: 'Heavy-duty canvas tote bag with reinforced handles and interior pocket. Eco-friendly washed canvas construction.', category: 'Bags', price: 39.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4facce6cd4c4.jpg' },
  { name: 'Messenger Bag Leather', description: 'Vintage-style leather messenger bag with adjustable shoulder strap. Fits 15-inch laptop with document organizer.', category: 'Bags', price: 89.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f0932f599b64.webp' },
  { name: 'Travel Duffel Large', description: 'Extra-large travel duffel bag with wheels and telescopic handle. Shoe compartment and wet pocket for gym gear.', category: 'Bags', price: 79.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9fa2e6c51bf2.jpg' },
  { name: 'Crossbody Sling Bag', description: 'Compact crossbody sling bag with anti-theft zipper. Multiple compartments for phone, wallet, and essentials.', category: 'Bags', price: 34.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/933cb62c2fff.jpg' },
  { name: 'Laptop Briefcase Premium', description: 'Professional briefcase with leather exterior and padded laptop sleeve. Organizer panel for pens, cards, and documents.', category: 'Bags', price: 109.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/4f0b650ad9a1.jpg' },
  { name: 'Fanny Pack Sport', description: 'Adjustable fanny pack with water-resistant nylon construction. Zippered main pocket and quick-access phone pocket.', category: 'Bags', price: 24.99, stock: 55, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c6f250eeb376.jpg' },
  { name: 'Rolling Suitcase 24-Inch', description: 'Hardshell spinner suitcase with TSA-approved lock and expandable design. 360-degree spinner wheels and telescopic handle.', category: 'Bags', price: 159.99, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a4916971e0ef.jpg' },
  { name: 'Gym Bag Compartment', description: 'Ventilated gym bag with separate shoe compartment and wet pocket. Durable polyester with padded shoulder strap.', category: 'Bags', price: 44.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3b262b669ce6.png' },
  { name: 'Clutch Evening Bag', description: 'Elegant evening clutch with metallic frame and satin lining. Detachable chain strap for shoulder or crossbody wear.', category: 'Bags', price: 59.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/47e25e8e84f7.jpg' },
  { name: 'Hiking Daypack 30L', description: 'Lightweight 30-liter hiking daypack with hydration compatibility. Air mesh back panel and rain cover included.', category: 'Bags', price: 89.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/86d98af71733.jpg' },
  { name: 'Diaper Bag Backpack', description: 'Spacious diaper bag backpack with insulated bottle pockets. Changing pad included with 10+ organizer compartments.', category: 'Bags', price: 69.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b8c8a1549ac.jpg' },

  // ═══════════ CLOTHING (12) ═══════════
  { name: 'Premium Cotton T-Shirt', description: '100% organic cotton crew neck t-shirt with pre-shrunk fabric. Soft hand feel with reinforced collar and shoulder seams.', category: 'Clothing', price: 29.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/322339844df7.jpg' },
  { name: 'Slim Fit Denim Jeans', description: 'Classic slim fit jeans in medium wash with stretch denim. Five-pocket design with zip fly and button closure.', category: 'Clothing', price: 59.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1b74703b5a23.jpg' },
  { name: 'Hoodie Pullover Fleece', description: 'Heavyweight fleece hoodie with kangaroo pocket and ribbed cuffs. Drawstring hood with brushed interior for warmth.', category: 'Clothing', price: 49.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/577dcca531f6.jpg' },
  { name: 'Linen Button-Down Shirt', description: 'Breathable linen shirt with relaxed fit and spread collar. Perfect for warm weather with chest pocket and curved hem.', category: 'Clothing', price: 64.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e3f99d4bff42.jpg' },
  { name: 'Wool Blend Overcoat', description: 'Tailored wool blend overcoat with notch lapel and double-breasted closure. Knee-length silhouette with interior pockets.', category: 'Clothing', price: 249.99, stock: 8, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/abc8a3b536fa.jpg' },
  { name: 'Athletic Joggers', description: 'Performance joggers with four-way stretch and moisture-wicking fabric. Zippered pockets and tapered leg design.', category: 'Clothing', price: 54.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7fbf39cd91b6.jpg' },
  { name: 'Casual Chino Pants', description: 'Classic chino pants with slim straight fit and garment-washed finish. Stretch cotton with permanent crease.', category: 'Clothing', price: 49.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3c4e0e796fcd.jpg' },
  { name: 'Puffer Jacket Winter', description: 'Insulated puffer jacket with water-resistant shell and synthetic fill. Packable design with elastic cuffs and hood.', category: 'Clothing', price: 129.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d629b9d269c6.jpg' },
  { name: 'Polo Shirt Classic', description: 'Premium pique cotton polo shirt with embroidered logo. Two-button placket and ribbed collar and armbands.', category: 'Clothing', price: 44.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce783118250c.jpg' },
  { name: 'Cargo Shorts Relaxed', description: 'Relaxed fit cargo shorts with multiple utility pockets. Durable ripstop fabric with reinforced hem.', category: 'Clothing', price: 39.99, stock: 38, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ac2a5461a5f8.jpg' },
  { name: 'Leather Biker Jacket', description: 'Genuine leather biker jacket with asymmetric zip and snap collar. Quilted lining with zippered pockets.', category: 'Clothing', price: 299.99, stock: 6, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e67add74ccfe.jpg' },
  { name: 'Summer Dress Floral', description: 'Lightweight floral print dress with V-neckline and flutter sleeves. A-line silhouette with side pockets.', category: 'Clothing', price: 59.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cfbc64a20bce.jpg' },

  // ═══════════ ACCESSORIES (12) ═══════════
  { name: 'Polarized Sunglasses', description: 'Premium polarized sunglasses with UV400 protection and lightweight acetate frames. Scratch-resistant lenses with spring hinges.', category: 'Accessories', price: 79.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1e47d36b3750.jpg' },
  { name: 'Leather Belt Classic', description: 'Full-grain leather belt with brushed metal buckle. 1.5-inch width with seven holes for adjustable fit.', category: 'Accessories', price: 39.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f9650a7c5270.jpg' },
  { name: 'Silk Scarf Patterned', description: 'Luxurious silk scarf with hand-rolled edges and original print. Versatile accessory for neck, hair, or bag styling.', category: 'Accessories', price: 49.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ae3ce09be115.jpg' },
  { name: 'Baseball Cap Classic', description: 'Washed cotton baseball cap with curved brim and adjustable strap-back. Pre-curved visor with ventilation eyelets.', category: 'Accessories', price: 24.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5f072e497b55.jpg' },
  { name: 'Wool Beanie Winter', description: 'Chunky knit wool beanie with fold-over cuff. Soft merino wool blend with fleece-lined interior for warmth.', category: 'Accessories', price: 29.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3f20f44a334b.jpg' },
  { name: 'Leather Wallet Bifold', description: 'Genuine leather bifold wallet with RFID blocking technology. 8 card slots, 2 bill compartments, and coin pocket.', category: 'Accessories', price: 44.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/da07a4f061f7.jpg' },
  { name: 'Cotton Socks 6-Pack', description: 'Premium cotton crew socks with reinforced heel and toe. Moisture-wicking with arch support and cushioned sole.', category: 'Accessories', price: 19.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c5f11a765e19.jpeg' },
  { name: 'Silk Tie Striped', description: 'Handmade silk tie with diagonal stripe pattern. Classic 3.25-inch width with keeper loop and textured finish.', category: 'Accessories', price: 34.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c6770c69ffd.jpg' },
  { name: 'Touch Screen Gloves', description: 'Winter gloves with touchscreen-compatible fingertips. Soft fleece lining with anti-slip palm grip.', category: 'Accessories', price: 24.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/73225b0b600f.jpg' },
  { name: 'Phone Crossbody Strap', description: 'Adjustable crossbody phone strap with genuine leather accents. Fits all smartphones with secure quick-release buckle.', category: 'Accessories', price: 19.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/cdf2f9482ad8.png' },
  { name: 'Leather Key Organizer', description: 'Compact leather key organizer holding up to 6 keys. Eliminates pocket bulk with sleek snap-closure design.', category: 'Accessories', price: 29.99, stock: 38, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/06022d460e17.jpg' },
  { name: 'Aviator Sunglasses Metal', description: 'Classic aviator sunglasses with metal frame and gradient lenses. Teardrop shape with adjustable nose pads.', category: 'Accessories', price: 69.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d1f09b0b21b7.jpg' },

  // ═══════════ SPORTS (12) ═══════════
  { name: 'Yoga Mat Premium', description: 'Extra-thick 6mm yoga mat with non-slip surface and alignment markers. Eco-friendly TPE material with carrying strap.', category: 'Sports', price: 39.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/be457407971e.webp' },
  { name: 'Adjustable Dumbbell Set', description: 'Adjustable dumbbell set from 5 to 52.5 lbs with quick-change dial system. Compact design replaces 15 sets of weights.', category: 'Sports', price: 349, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bc9032772522.jpg' },
  { name: 'Running Armband Phone', description: 'Lightweight running armband with sweat-resistant neoprene. Fits phones up to 6.7 inches with reflective strip.', category: 'Sports', price: 19.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/57200c4044a1.jpg' },
  { name: 'Resistance Bands Set', description: 'Set of 5 resistance bands with different tension levels. Includes door anchor, handles, and ankle straps.', category: 'Sports', price: 29.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/667ef98ca816.jpg' },
  { name: 'Soccer Ball Official', description: 'Official size and weight soccer ball with machine-stitched construction. Durable TPU cover for all playing surfaces.', category: 'Sports', price: 29.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0f39f24b4b3d.png' },
  { name: 'Gym Gloves Training', description: 'Padded gym gloves with wrist support and breathable mesh back. Anti-slip palm grip with pull-tab for easy removal.', category: 'Sports', price: 24.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d63efdf2c1e5.jpg' },
  { name: 'Pull-Up Bar Doorway', description: 'Multi-grip doorway pull-up bar with padded handles. Supports up to 300 lbs with easy mounting system.', category: 'Sports', price: 34.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a783ccd2af6d.png' },
  { name: 'Jump Rope Speed', description: 'Precision speed jump rope with ball-bearing system and adjustable cable. Foam handles with anti-slip grip.', category: 'Sports', price: 14.99, stock: 55, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fc09dc9f9cb4.jpg' },
  { name: 'Foam Roller Recovery', description: 'High-density foam roller for muscle recovery and self-myofascial release. Textured surface for deep tissue massage.', category: 'Sports', price: 29.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/90d304db6bea.jpg' },
  { name: 'Basketball Official', description: 'Official size indoor/outdoor basketball with composite leather cover. Deep channel design for superior grip.', category: 'Sports', price: 39.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/9686bfa77efb.jpg' },
  { name: 'Boxing Gloves 12oz', description: 'Training boxing gloves with multi-layer foam padding and full wrist support. Breathable mesh palm with hook-and-loop closure.', category: 'Sports', price: 44.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f657ba916c2d.jpg' },
  { name: 'Sports Water Bottle 1L', description: 'Insulated stainless steel water bottle with 24-hour cold retention. Leak-proof lid with carrying loop and motivational markings.', category: 'Sports', price: 24.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f67782740020.jpg' },

  // ═══════════ WATCHES (12) ═══════════
  { name: 'Seiko Presage Automatic', description: 'Japanese automatic dress watch with enamel dial and power reserve indicator. 40mm stainless steel case with sapphire crystal.', category: 'Watches', price: 499, stock: 8, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d101cf894fdc.jpg' },
  { name: 'Apple Watch Series 9', description: 'Smartwatch with always-on Retina display and advanced health sensors. GPS and cellular with crash detection feature.', category: 'Watches', price: 399, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/aedbecaaba25.jpg' },
  { name: 'Casio G-Shock Classic', description: 'Iconic shock-resistant digital watch with 200m water resistance. Stopwatch, countdown timer, and backlight with world time.', category: 'Watches', price: 79.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ce4ed1e99602.png' },
  { name: 'Citizen Eco-Drive', description: 'Solar-powered watch with perpetual calendar and atomic timekeeping. Sapphire crystal with brown leather strap.', category: 'Watches', price: 299, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/df5fa66fc8fb.jpg' },
  { name: 'Timex Weekender Casual', description: 'Casual everyday watch with Indiglo backlight and NATO strap. 40mm brass case with quartz movement and date display.', category: 'Watches', price: 49.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/84bf64640fd9.jpg' },
  { name: 'Garmin Fenix 7X', description: 'Premium multisport GPS watch with solar charging and mapping. Titanium case with 28-day battery in smartwatch mode.', category: 'Watches', price: 899.99, stock: 6, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c69037a8c820.jpg' },
  { name: 'Fossil Gen 6 Smartwatch', description: 'Fashion-forward smartwatch with Wear OS and Snapdragon processor. Heart rate tracking with always-on AMOLED display.', category: 'Watches', price: 299, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/02ea33ae328e.jpg' },
  { name: 'Tissot Seastar 1000', description: 'Professional diver watch with 300m water resistance and ceramic bezel. Powermatic 80 movement with 80-hour power reserve.', category: 'Watches', price: 675, stock: 5, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/91efa45fc32b.jpg' },
  { name: 'Samsung Galaxy Watch 6', description: 'Android smartwatch with BioActive sensor and rotating bezel. Advanced sleep tracking with 40-hour battery life.', category: 'Watches', price: 329.99, stock: 14, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/fafb6eb9237c.jpg' },
  { name: 'Orient Bambino Dress', description: 'Elegant dress watch with domed crystal and sunburst dial. Automatic movement with exhibition caseback and 40mm case.', category: 'Watches', price: 199.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/24939174f45c.jpg' },
  { name: 'Fitbit Versa 4', description: 'Fitness smartwatch with built-in GPS and 100+ exercise modes. Stress management tools with 6-day battery life.', category: 'Watches', price: 229.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3a8ef77cf468.jpg' },
  { name: 'Bulova Marine Star', description: 'Classic marine watch with screw-back case and 200m water resistance. Japanese quartz movement with mineral crystal.', category: 'Watches', price: 189.99, stock: 16, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/140db0c55079.jpg' },

  // ═══════════ SKINCARE (12) ═══════════
  { name: 'Vitamin C Serum 30ml', description: 'Professional strength 20% vitamin C serum with hyaluronic acid. Brightens skin, reduces dark spots, and boosts collagen.', category: 'Skincare', price: 34.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/42374aa13b2e.jpg' },
  { name: 'Retinol Night Cream', description: 'Advanced retinol night cream with peptides and niacinamide. Reduces fine lines and wrinkles while you sleep.', category: 'Skincare', price: 44.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/06f59eea229d.jpg' },
  { name: 'Hyaluronic Acid Moisturizer', description: 'Lightweight gel moisturizer with triple-weight hyaluronic acid. Deep hydration for all skin types with oil-free formula.', category: 'Skincare', price: 29.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/27125e4602bb.jpg' },
  { name: 'SPF 50 Sunscreen', description: 'Broad spectrum SPF 50 sunscreen with lightweight non-greasy formula. Water-resistant for 80 minutes with no white cast.', category: 'Skincare', price: 24.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/40a49157ca67.jpg' },
  { name: 'Niacinamide Toner', description: 'Alcohol-free toner with 10% niacinamide and zinc PCA. Minimizes pores and controls oil production.', category: 'Skincare', price: 19.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e3d61c9bb2f6.png' },
  { name: 'Salicylic Acid Cleanser', description: 'Gentle foaming cleanser with 2% salicylic acid for acne-prone skin. Deep pore cleansing with soothing aloe vera.', category: 'Skincare', price: 16.99, stock: 55, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0f5934623937.png' },
  { name: 'Eye Cream Anti-Aging', description: 'Targeted eye cream with caffeine and peptides. Reduces puffiness, dark circles, and fine lines around delicate eye area.', category: 'Skincare', price: 39.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/241efee238fc.jpg' },
  { name: 'Clay Mask Purifying', description: 'Deep cleansing kaolin clay mask with charcoal and tea tree oil. Draws out impurities and unclogs pores in 15 minutes.', category: 'Skincare', price: 21.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/eb2d8309d958.jpg' },
  { name: 'Face Oil Rosehip', description: 'Cold-pressed rosehip seed oil rich in vitamins A and C. Nourishes skin, fades scars, and improves skin elasticity.', category: 'Skincare', price: 26.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/433fc3b81342.png' },
  { name: 'Aloe Vera Gel Organic', description: 'Pure organic aloe vera gel for face and body. Soothes sunburn, hydrates skin, and calms irritation without stickiness.', category: 'Skincare', price: 14.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3765f2d33a70.jpg' },
  { name: 'Exfoliating Scrub', description: 'Gentle facial scrub with walnut shell powder and jojoba beads. Removes dead skin cells for smoother, radiant complexion.', category: 'Skincare', price: 18.99, stock: 38, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f2bcbc5076c0.jpg' },
  { name: 'Sheet Masks Pack 10', description: 'Pack of 10 hydrating sheet masks with green tea and rice extract. Individually sealed for single-use application.', category: 'Skincare', price: 22.99, stock: 42, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c1ce0e9c36d1.jpg' },

  // ═══════════ BOOKS (12) ═══════════
  { name: 'The Art of Programming', description: 'Comprehensive guide to software development best practices and algorithms. Covers data structures, design patterns, and system design.', category: 'Books', price: 49.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/726d0b16cb54.jpg' },
  { name: 'World History Encyclopedia', description: 'Illustrated encyclopedia covering world history from ancient civilizations to modern era. 500+ pages with maps and timelines.', category: 'Books', price: 39.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/b1885e931afa.png' },
  { name: 'Mindset Psychology Guide', description: 'Bestselling book on growth mindset and achievement psychology. Practical strategies for personal and professional development.', category: 'Books', price: 16.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3b7cdcdc4fb0.jpg' },
  { name: 'Cooking Masterclass Cookbook', description: 'Professional cookbook with 500+ recipes from world-renowned chefs. Step-by-step instructions with full-color photography.', category: 'Books', price: 34.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0de07585a3d7.jpg' },
  { name: 'Science Fiction Collection', description: 'Anthology of classic science fiction stories from legendary authors. Curated collection with author biographies and commentary.', category: 'Books', price: 24.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/756c72caa7cc.jpg' },
  { name: 'Financial Freedom Guide', description: 'Complete guide to personal finance, investing, and wealth building. Covers budgeting, stocks, real estate, and retirement.', category: 'Books', price: 19.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/76115756d156.jpg' },
  { name: 'Art of Photography', description: 'Stunning photography book showcasing iconic images and techniques. Covers composition, lighting, and post-processing workflows.', category: 'Books', price: 44.99, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/bb299ed85800.png' },
  { name: 'Children Storybook Set', description: 'Boxed set of 10 illustrated children storybooks with moral lessons. Age-appropriate content for ages 3-8 with vibrant artwork.', category: 'Books', price: 29.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/26faf96dd235.jpg' },
  { name: 'Fitness Training Manual', description: 'Complete fitness training guide with workout plans and nutrition advice. Covers strength, cardio, flexibility, and recovery.', category: 'Books', price: 27.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1bce0cf24681.png' },
  { name: 'Mystery Thriller Novel', description: 'Gripping mystery thriller with unexpected plot twists and complex characters. 400-page page-turner from bestselling author.', category: 'Books', price: 14.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f10792f42c8a.jpg' },
  { name: 'Self-Help Bestseller', description: 'Transformative self-help book on building habits and achieving goals. Evidence-based strategies with real-world case studies.', category: 'Books', price: 17.99, stock: 38, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6c78969dbca7.jpg' },
  { name: 'Travel Atlas World', description: 'Comprehensive world atlas with detailed maps of every country. Includes travel tips, cultural highlights, and statistics.', category: 'Books', price: 54.99, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/c3239ed79154.jpg' },

  // ═══════════ KITCHEN (12) ═══════════
  { name: 'Stainless Steel Cookware Set', description: '10-piece stainless steel cookware set with aluminum core. Includes pots, pans, and lids with stay-cool handles.', category: 'Kitchen', price: 199.99, stock: 12, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/972de2f48cd8.jpg' },
  { name: 'Knife Block Set 14-Piece', description: 'Professional 14-piece knife block set with German stainless steel blades. Includes chef knife, bread knife, steak knives, and more.', category: 'Kitchen', price: 149.99, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/508a95f45aa5.jpg' },
  { name: 'Stand Mixer Professional', description: '5-quart stand mixer with 10 speeds and planetary mixing action. Includes flat beater, dough hook, and wire whip.', category: 'Kitchen', price: 349.99, stock: 8, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/99a8722b9124.jpg' },
  { name: 'Air Fryer Digital 6Qt', description: '6-quart digital air fryer with 8 preset cooking programs. Rapid air circulation technology for crispy results with less oil.', category: 'Kitchen', price: 89.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ceea82d6d1e2.jpg' },
  { name: 'Blender High-Powered', description: '1500W high-powered blender with 72-oz pitcher and stainless steel blades. Crushes ice, blends smoothies, and purees soups.', category: 'Kitchen', price: 129.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/2fabac9dee72.jpg' },
  { name: 'Nonstick Frying Pan 12-Inch', description: 'Premium nonstick frying pan with ceramic coating and stainless steel handle. Oven-safe to 450F with even heat distribution.', category: 'Kitchen', price: 39.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7c20759ff6a0.jpg' },
  { name: 'Coffee Maker Programmable', description: '12-cup programmable coffee maker with brew strength control. Auto-start timer with pause-and-serve and removable water reservoir.', category: 'Kitchen', price: 79.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/d691b2c0d5cb.jpg' },
  { name: 'Food Processor 11-Cup', description: '11-cup food processor with multiple blade attachments. Slices, shreds, chops, and kneads with pulse and continuous settings.', category: 'Kitchen', price: 119.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/08890fedfd98.jpg' },
  { name: 'Cutting Board Set 3-Pack', description: 'Set of 3 bamboo cutting boards in different sizes. Juice grooves with non-slip edges and easy-grip handles.', category: 'Kitchen', price: 29.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/184a86d3cb15.jpg' },
  { name: 'Measuring Cups Stainless', description: 'Set of 6 stainless steel measuring cups with engraved markings. Stackable design with ergonomic handles and comfort pour spouts.', category: 'Kitchen', price: 19.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/83fa984d4c29.jpg' },
  { name: 'Dutch Oven Enameled', description: '6-quart enameled cast iron Dutch oven with tight-fitting lid. Superior heat retention for braising, baking, and stewing.', category: 'Kitchen', price: 89.99, stock: 14, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/940c7a03267a.jpg' },
  { name: 'Electric Kettle Gooseneck', description: 'Precision gooseneck kettle with variable temperature control. Pour-over ready with stainless steel body and auto shut-off.', category: 'Kitchen', price: 59.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/88fe7d6480dc.jpg' },
// ═══════════ TOYS & GAMES (12) ═══════════
  { name: 'LEGO Architecture Set', description: 'LEGO Architecture Skyline Collection. Build iconic city skylines with detailed micro-scale models for ages 12+.', category: 'Toys & Games', price: 49.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5d3a1b352b66.jpg' },
  { name: 'Board Game Strategy', description: 'Award-winning strategy board game for 2-5 players. Build civilizations and compete for resources in this family favorite.', category: 'Toys & Games', price: 39.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/136fcc1bc11e.jpg' },
  { name: 'RC Drone Camera 4K', description: 'Foldable RC drone with 4K HD camera and GPS. 30-minute flight time with return-to-home function and altitude hold.', category: 'Toys & Games', price: 129.99, stock: 15, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/7771ea6474d8.jpg' },
  { name: 'Puzzle 1000 Pieces', description: '1000-piece jigsaw puzzle with premium quality pieces. Beautiful landscape design, frame-ready when complete.', category: 'Toys & Games', price: 19.99, stock: 40, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/81e573727eb1.jpg' },
  { name: 'Building Blocks 500-Piece', description: 'Classic 500-piece building block set compatible with major brands. Endless creative possibilities for kids and adults.', category: 'Toys & Games', price: 29.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/254cb4313fb9.jpg' },
  { name: 'Remote Control Racing Car', description: 'High-speed RC racing car with 2.4GHz remote. Reaches 25mph with rechargeable battery included.', category: 'Toys & Games', price: 59.99, stock: 28, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0ffb474a9a03.jpg' },
  { name: 'Card Game Party Edition', description: 'Hilarious party card game for 4-20 players. Easy to learn, impossible to forget. Great for game nights.', category: 'Toys & Games', price: 24.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/ea509559374f.jpg' },
  { name: 'Wooden Chess Set', description: 'Handcrafted wooden chess set with folding board. Premium carved pieces with felt-lined storage compartment.', category: 'Toys & Games', price: 44.99, stock: 22, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0844a9afec2d.jpg' },
 { name: 'Science Experiment Kit', description: 'STEM science experiment kit with 100+ activities. Chemistry, physics, and biology experiments for ages 8+.', category: 'Toys & Games', price: 34.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/66d2d5de4a76.jpg' },
  { name: 'Plush Teddy Bear Giant', description: 'Giant 3-foot plush teddy bear made from premium soft polyester. Hypoallergenic and machine washable.', category: 'Toys & Games', price: 39.99, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/a365dda27232.jpg' },
  { name: 'Electronic Learning Tablet', description: 'Interactive learning tablet for kids with educational games and apps. 10-inch screen with parental controls and durable case.', category: 'Toys & Games', price: 89.99, stock: 18, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/0174776178c4.jpg' },
  { name: 'Outdoor Explorer Kit', description: 'Complete outdoor exploration kit with binoculars, compass, and magnifying glass. Encourages nature discovery for young adventurers.', category: 'Toys & Games', price: 27.99, stock: 32, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/3d7ae1a920db.jpg' },

  // ═══════════ JEWELRY (12) ═══════════
  { name: 'Diamond Stud Earrings', description: 'Brilliant cut diamond stud earrings set in 14K white gold. Classic round 0.5ct total weight with secure push-back posts.', category: 'Jewelry', price: 299, stock: 10, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/6278c882cf85.jpg' },
  { name: 'Gold Chain Necklace', description: '18K gold plated chain necklace with lobster clasp. Versatile 20-inch length perfect for everyday wear.', category: 'Jewelry', price: 79.99, stock: 35, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e291439e2a41.jpg' },
  { name: 'Silver Pendant Necklace', description: 'Sterling silver pendant necklace with delicate chain. Minimalist geometric design, hypoallergenic and tarnish-resistant.', category: 'Jewelry', price: 49.99, stock: 45, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/21240fe8e6c0.webp' },
  { name: 'Pearl Strand Bracelet', description: 'Genuine freshwater pearl strand bracelet with sterling silver clasp. Timeless elegant design for any occasion.', category: 'Jewelry', price: 89, stock: 20, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/5b9148b76e65.webp' },
  { name: 'Ruby Diamond Ring', description: 'Natural ruby ring with diamond halo set in 14K rose gold. Stunning statement piece with 1.2ct total gemstone weight.', category: 'Jewelry', price: 599, stock: 5, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/399d88a28452.jpeg' },
  { name: 'Gold Hoop Earrings', description: 'Medium-size gold hoop earrings with click-top closure. Lightweight and comfortable for all-day wear.', category: 'Jewelry', price: 34.99, stock: 55, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/f991b6914e64.jpeg' },
  { name: 'Diamond Tennis Bracelet', description: 'Classic tennis bracelet with 3ct round brilliant diamonds set in platinum. Secure box clasp with safety latch.', category: 'Jewelry', price: 1299, stock: 3, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/89f88688711f.jpg' },
  { name: 'Layered Necklace Set', description: 'Set of 3 layered necklaces in gold, silver, and rose gold. Delicate chains with simple pendants.', category: 'Jewelry', price: 39.99, stock: 60, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/416599f0e519.webp' },
  { name: 'Silver Signet Ring', description: 'Sterling silver signet ring with polished flat top. Classic design with engravable surface for personalization.', category: 'Jewelry', price: 59.99, stock: 30, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/e05b7de3705c.jpg' },
  { name: 'Charm Bracelet Starter', description: 'Sterling silver charm bracelet with 5 detachable charms. Add more charms for personal customization.', category: 'Jewelry', price: 69.99, stock: 25, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/1b67854742c6.jpg' },
  { name: 'Sapphire Cocktail Ring', description: 'Lab-created blue sapphire cocktail ring with white gold setting. Art deco inspired design with intricate filigree details.', category: 'Jewelry', price: 199, stock: 8, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/235e3531a151.jpg' },
  { name: 'Rose Gold Bar Pendant', description: 'Horizontal bar pendant on fine chain in rose gold finish. Modern minimalist everyday necklace with 18-inch chain.', category: 'Jewelry', price: 29.99, stock: 50, image: 'https://z-cdn.chatglm.cn/image-search-mcp/images-ppt/926a65c04a66.jpg' }
];

async function seedDatabase() {
  try {
    // Connect using either MONGODB_URI or MONGO_URI
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI;
    if (!uri) {
      console.error('ERROR: No MongoDB URI found in .env (need MONGODB_URI or MONGO_URI)');
      process.exit(1);
    }
    console.log('Connecting to MongoDB...');
    await mongoose.connect(uri);
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const result = await Product.insertMany(products);
    console.log('Inserted ' + result.length + ' products');

    // Print summary by category
    const catCount = {};
    result.forEach(p => {
      catCount[p.category] = (catCount[p.category] || 0) + 1;
    });
    console.log('\nProducts per category:');
    Object.entries(catCount).forEach(([cat, count]) => {
      console.log('  ' + cat + ': ' + count);
    });
    console.log('\nTotal: ' + result.length + ' products across ' + Object.keys(catCount).length + ' categories');

  } catch (error) {
    console.error('Seed error:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('\nDisconnected from MongoDB');
  }
}

seedDatabase();
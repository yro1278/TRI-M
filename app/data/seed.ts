import type { Product, Supplier, Order, SalesRecord, Activity } from "@/lib/api";

export const seedCategories = [
  { name: "Electronics", slug: "electronics" },
  { name: "Fashion", slug: "fashion" },
  { name: "Home & Living", slug: "home-living" },
  { name: "Sports", slug: "sports" },
  { name: "Beauty", slug: "beauty" },
  { name: "Accessories", slug: "accessories" },
];

export const seedProducts: Product[] = [
  { id: 1, name: "Wireless Noise-Cancelling Headphones", brand: "SonicWave", price: 249.99, cost: 145.00, originalPrice: 349.99, rating: 4.8, reviews: 2341, badge: "-29%", image: "🎧", category: "Electronics", inStock: true, stock: 156, sku: "SNC-001", createdAt: "2025-01-15" },
  { id: 2, name: "Premium Cotton Hoodie", brand: "UrbanCore", price: 89.99, cost: 38.00, rating: 4.6, reviews: 1523, badge: "Best Seller", image: "👕", category: "Fashion", inStock: true, stock: 342, sku: "UC-042", createdAt: "2025-02-10" },
  { id: 3, name: "Minimalist Desk Lamp", brand: "NordicHome", price: 59.99, cost: 28.00, originalPrice: 79.99, rating: 4.7, reviews: 876, badge: "New", image: "💡", category: "Home & Living", inStock: true, stock: 89, sku: "NH-221", createdAt: "2025-03-05" },
  { id: 4, name: "Running Shoes UltraBoost", brand: "ApexFit", price: 159.99, cost: 85.00, originalPrice: 199.99, rating: 4.9, reviews: 3102, badge: "-20%", image: "👟", category: "Sports", inStock: true, stock: 210, sku: "AF-903", createdAt: "2025-01-20" },
  { id: 5, name: "Smart Watch Pro Series", brand: "TechVibe", price: 329.99, cost: 180.00, rating: 4.5, reviews: 4567, badge: "Trending", image: "⌚", category: "Electronics", inStock: false, stock: 0, sku: "TV-600", createdAt: "2025-04-12" },
  { id: 6, name: "Organic Skincare Set", brand: "GlowLab", price: 45.99, cost: 22.00, originalPrice: 65.99, rating: 4.4, reviews: 654, badge: "Sale", image: "🧴", category: "Beauty", inStock: true, stock: 445, sku: "GL-112", createdAt: "2025-02-28" },
  { id: 7, name: "Portable Bluetooth Speaker", brand: "BassDrop", price: 79.99, cost: 38.00, originalPrice: 99.99, rating: 4.6, reviews: 1890, badge: "Popular", image: "🔊", category: "Electronics", inStock: true, stock: 167, sku: "BD-770", createdAt: "2025-03-18" },
  { id: 8, name: "Leather Crossbody Bag", brand: "VogueStreet", price: 129.99, cost: 62.00, rating: 4.7, reviews: 2345, badge: "Premium", image: "👜", category: "Fashion", inStock: true, stock: 98, sku: "VS-301", createdAt: "2025-01-08" },
  { id: 9, name: "Ergonomic Office Chair", brand: "WorkWell", price: 449.99, cost: 210.00, originalPrice: 599.99, rating: 4.3, reviews: 1234, badge: "-25%", image: "🪑", category: "Home & Living", inStock: true, stock: 45, sku: "WW-101", createdAt: "2025-04-01" },
  { id: 10, name: "Yoga Mat Premium", brand: "FlexFit", price: 34.99, cost: 12.00, rating: 4.5, reviews: 3421, badge: "Best Seller", image: "🧘", category: "Sports", inStock: true, stock: 523, sku: "FF-050", createdAt: "2025-02-14" },
  { id: 11, name: "Wireless Charging Pad", brand: "TechVibe", price: 29.99, cost: 12.00, originalPrice: 39.99, rating: 4.2, reviews: 5678, badge: "Sale", image: "📱", category: "Electronics", inStock: true, stock: 678, sku: "TV-120", createdAt: "2025-03-22" },
  { id: 12, name: "Cashmere Scarf", brand: "LuxeWear", price: 79.99, cost: 35.00, rating: 4.8, reviews: 876, badge: "Premium", image: "🧣", category: "Fashion", inStock: true, stock: 134, sku: "LW-008", createdAt: "2025-04-05" },
];

export const seedSuppliers: Supplier[] = [
  { id: 1, name: "TechSupply Pro", contact: "James Liu", email: "james@techsupply.com", phone: "+1 (555) 123-4567", address: "123 Industrial Blvd, San Jose, CA", categories: ["Electronics", "Accessories"], rating: 4.7, status: "active", totalOrders: 342, onTimeDelivery: 94, qualityRating: 92, pricingCompetitiveness: 85, responseTime: 88, orderAccuracy: 96, evaluationScore: 91, evaluationGrade: "A", logo: "🔬", since: "2021-03-15" },
  { id: 2, name: "FashionFirst Distributors", contact: "Maria Garcia", email: "maria@fashionfirst.com", phone: "+1 (555) 234-5678", address: "456 Fashion Ave, New York, NY", categories: ["Fashion", "Accessories"], rating: 4.5, status: "active", totalOrders: 287, onTimeDelivery: 88, qualityRating: 90, pricingCompetitiveness: 82, responseTime: 85, orderAccuracy: 92, evaluationScore: 87, evaluationGrade: "B", logo: "👗", since: "2022-01-10" },
  { id: 3, name: "HomeStyle Wholesale", contact: "Robert Chen", email: "robert@homestyle.com", phone: "+1 (555) 345-6789", address: "789 Decor Dr, Chicago, IL", categories: ["Home & Living", "Furniture"], rating: 4.3, status: "active", totalOrders: 198, onTimeDelivery: 82, qualityRating: 88, pricingCompetitiveness: 90, responseTime: 80, orderAccuracy: 86, evaluationScore: 85, evaluationGrade: "B", logo: "🏠", since: "2022-06-20" },
  { id: 4, name: "SportGear Manufacturing", contact: "Sarah Williams", email: "sarah@sportgear.com", phone: "+1 (555) 456-7890", address: "321 Athletic Way, Portland, OR", categories: ["Sports", "Outdoor"], rating: 4.8, status: "active", totalOrders: 156, onTimeDelivery: 97, qualityRating: 95, pricingCompetitiveness: 78, responseTime: 92, orderAccuracy: 98, evaluationScore: 92, evaluationGrade: "A", logo: "⚽", since: "2021-09-01" },
  { id: 5, name: "GreenLeaf Cosmetics", contact: "Emily Park", email: "emily@greenleaf.com", phone: "+1 (555) 567-8901", address: "567 Beauty Ln, Los Angeles, CA", categories: ["Beauty", "Personal Care"], rating: 4.2, status: "active", totalOrders: 89, onTimeDelivery: 76, qualityRating: 84, pricingCompetitiveness: 88, responseTime: 72, orderAccuracy: 80, evaluationScore: 80, evaluationGrade: "B", logo: "🌿", since: "2023-02-14" },
  { id: 6, name: "Prime Logistics Co", contact: "David Thompson", email: "david@primelogistics.com", phone: "+1 (555) 678-9012", address: "890 Cargo Rd, Houston, TX", categories: ["Logistics"], rating: 3.9, status: "active", totalOrders: 423, onTimeDelivery: 72, qualityRating: 78, pricingCompetitiveness: 92, responseTime: 65, orderAccuracy: 76, evaluationScore: 76, evaluationGrade: "C", logo: "📦", since: "2022-11-05" },
  { id: 7, name: "LuxeMaterials Ltd", contact: "Angela White", email: "angela@luxematerials.com", phone: "+1 (555) 789-0123", address: "432 Premium St, San Francisco, CA", categories: ["Fashion", "Accessories"], rating: 4.9, status: "active", totalOrders: 67, onTimeDelivery: 98, qualityRating: 97, pricingCompetitiveness: 72, responseTime: 95, orderAccuracy: 99, evaluationScore: 92, evaluationGrade: "A", logo: "✨", since: "2023-06-01" },
  { id: 8, name: "EcoPack Solutions", contact: "Tom Rivera", email: "tom@ecopack.com", phone: "+1 (555) 890-1234", address: "156 Green Way, Denver, CO", categories: ["Packaging", "Supplies"], rating: 4.1, status: "inactive", totalOrders: 45, onTimeDelivery: 68, qualityRating: 82, pricingCompetitiveness: 86, responseTime: 70, orderAccuracy: 74, evaluationScore: 76, evaluationGrade: "C", logo: "♻️", since: "2023-09-20" },
];

export const seedOrders: Order[] = [
  { id: 1, orderNo: "ORD-3284", customer: "Michael Chen", email: "michael@email.com", items: [{ productId: 1, name: "Wireless Noise-Cancelling Headphones", price: 249.99, quantity: 1 }, { productId: 7, name: "Portable Bluetooth Speaker", price: 79.99, quantity: 1 }], subtotal: 329.98, shipping: 0, tax: 26.40, total: 356.38, status: "processing", paymentMethod: "Credit Card", createdAt: "2026-07-06T10:30:00Z" },
  { id: 2, orderNo: "ORD-3283", customer: "Sarah Kim", email: "sarah@email.com", items: [{ productId: 2, name: "Premium Cotton Hoodie", price: 89.99, quantity: 2 }, { productId: 8, name: "Leather Crossbody Bag", price: 129.99, quantity: 1 }], subtotal: 309.97, shipping: 0, tax: 24.80, total: 334.77, status: "shipped", paymentMethod: "PayPal", createdAt: "2026-07-05T14:20:00Z" },
  { id: 3, orderNo: "ORD-3282", customer: "Alex Rivera", email: "alex@email.com", items: [{ productId: 4, name: "Running Shoes UltraBoost", price: 159.99, quantity: 1 }], subtotal: 159.99, shipping: 15.99, tax: 12.80, total: 188.78, status: "delivered", paymentMethod: "Debit Card", createdAt: "2026-07-04T09:15:00Z", deliveredAt: "2026-07-06T11:00:00Z" },
  { id: 4, orderNo: "ORD-3281", customer: "Emma Wilson", email: "emma@email.com", items: [{ productId: 10, name: "Yoga Mat Premium", price: 34.99, quantity: 2 }, { productId: 6, name: "Organic Skincare Set", price: 45.99, quantity: 1 }], subtotal: 115.97, shipping: 15.99, tax: 9.28, total: 141.24, status: "pending", paymentMethod: "Credit Card", createdAt: "2026-07-06T08:00:00Z" },
  { id: 5, orderNo: "ORD-3280", customer: "TechCorp Inc", email: "orders@techcorp.com", items: [{ productId: 1, name: "Wireless Noise-Cancelling Headphones", price: 249.99, quantity: 5 }, { productId: 11, name: "Wireless Charging Pad", price: 29.99, quantity: 10 }], subtotal: 1549.85, shipping: 0, tax: 123.99, total: 1673.84, status: "processing", paymentMethod: "Wire Transfer", createdAt: "2026-07-05T16:45:00Z" },
  { id: 6, orderNo: "ORD-3279", customer: "Lisa Park", email: "lisa@email.com", items: [{ productId: 12, name: "Cashmere Scarf", price: 79.99, quantity: 1 }], subtotal: 79.99, shipping: 15.99, tax: 6.40, total: 102.38, status: "cancelled", paymentMethod: "PayPal", createdAt: "2026-07-03T11:30:00Z" },
  { id: 7, orderNo: "ORD-3278", customer: "James Brown", email: "james@email.com", items: [{ productId: 3, name: "Minimalist Desk Lamp", price: 59.99, quantity: 1 }, { productId: 9, name: "Ergonomic Office Chair", price: 449.99, quantity: 1 }], subtotal: 509.98, shipping: 0, tax: 40.80, total: 550.78, status: "delivered", paymentMethod: "Credit Card", createdAt: "2026-07-01T13:00:00Z", deliveredAt: "2026-07-04T10:00:00Z" },
  { id: 8, orderNo: "ORD-3277", customer: "Nina Patel", email: "nina@email.com", items: [{ productId: 5, name: "Smart Watch Pro Series", price: 329.99, quantity: 1 }], subtotal: 329.99, shipping: 0, tax: 26.40, total: 356.39, status: "pending", paymentMethod: "Debit Card", createdAt: "2026-07-06T07:15:00Z" },
];

export const seedSales: SalesRecord[] = [
  { month: "Jan", year: 2026, revenue: 18500, orders: 142, cost: 9800 },
  { month: "Feb", year: 2026, revenue: 22300, orders: 168, cost: 11500 },
  { month: "Mar", year: 2026, revenue: 19800, orders: 154, cost: 10200 },
  { month: "Apr", year: 2026, revenue: 27600, orders: 189, cost: 14100 },
  { month: "May", year: 2026, revenue: 31200, orders: 221, cost: 15800 },
  { month: "Jun", year: 2026, revenue: 28900, orders: 253, cost: 14300 },
  { month: "Jul", year: 2026, revenue: 34500, orders: 267, cost: 17600 },
  { month: "Aug", year: 2026, revenue: 41200, orders: 298, cost: 21300 },
  { month: "Sep", year: 2026, revenue: 38400, orders: 276, cost: 19800 },
  { month: "Oct", year: 2026, revenue: 42300, orders: 312, cost: 22400 },
  { month: "Nov", year: 2026, revenue: 46700, orders: 345, cost: 23800 },
  { month: "Dec", year: 2026, revenue: 52100, orders: 389, cost: 26100 },
];

export const seedActivities: Activity[] = [
  { id: 1, type: "order", text: "New order #3284 from Michael Chen", time: "2 min ago", amount: "$356.38" },
  { id: 2, type: "product", text: "Wireless Headphones restocked (+50 units)", time: "15 min ago", amount: "50 units" },
  { id: 3, type: "customer", text: "New customer: Sarah Kim registered", time: "1 hr ago" },
  { id: 4, type: "payment", text: "Refund processed for order #3279", time: "2 hr ago", amount: "$102.38" },
  { id: 5, type: "order", text: "Bulk order #3280 — 15 items from TechCorp", time: "3 hr ago", amount: "$1,673.84" },
  { id: 6, type: "supplier", text: "SportGear Manufacturing — shipment dispatched", time: "5 hr ago" },
  { id: 7, type: "order", text: "Order #3278 marked as delivered", time: "1 day ago", amount: "$550.78" },
];

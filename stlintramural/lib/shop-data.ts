import type { ShopItemDisplay } from "@/types/shop";

export const SHOP_ITEMS: ShopItemDisplay[] = [
  {
    id: "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    seller_id: "s1111111-1111-4111-8111-111111111111",
    title: "STL Intramural Hoodie",
    description:
      "Premium heavyweight fleece hoodie with embroidered STL Intramural logo. Available in navy and heather gray.",
    stock: 24,
    cost: 800,
    created_at: "2025-09-12T14:30:00.000Z",
    icon: "checkroom",
    category: "Apparel",
    imageUrl:
      "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=800&q=80",
    seller: {
      id: "s1111111-1111-4111-8111-111111111111",
      first_name: "Campus",
      last_name: "Rec",
      role: "admin",
    },
  },
  {
    id: "b2c3d4e5-f6a7-8901-bcde-f12345678901",
    seller_id: "s1111111-1111-4111-8111-111111111111",
    title: "Insulated Water Bottle",
    description:
      "32oz stainless steel bottle with STL branding. Keeps drinks cold for 24 hours.",
    stock: 45,
    cost: 350,
    created_at: "2025-10-01T09:15:00.000Z",
    icon: "water_drop",
    category: "Accessories",
    imageUrl:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&q=80",
    seller: {
      id: "s1111111-1111-4111-8111-111111111111",
      first_name: "Campus",
      last_name: "Rec",
      role: "admin",
    },
  },
  {
    id: "c3d4e5f6-a7b8-9012-cdef-123456789012",
    seller_id: "s2222222-2222-4222-8222-222222222222",
    title: "Championship T-Shirt",
    description:
      "Commemorative tee for Fall 2025 league winners. Soft ring-spun cotton.",
    stock: 18,
    cost: 450,
    created_at: "2025-10-18T16:45:00.000Z",
    icon: "styler",
    category: "Apparel",
    imageUrl:
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80",
    seller: {
      id: "s2222222-2222-4222-8222-222222222222",
      first_name: "Alex",
      last_name: "Rivera",
      role: "teacher",
    },
  },
  {
    id: "d4e5f6a7-b8c9-0123-def0-234567890123",
    seller_id: "s1111111-1111-4111-8111-111111111111",
    title: "VIP Courtside Pass",
    description:
      "Exclusive access to the championship game with reserved seating and complimentary snacks.",
    stock: 8,
    cost: 1200,
    created_at: "2025-11-01T11:00:00.000Z",
    icon: "confirmation_number",
    category: "Experiences",
    imageUrl:
      "https://images.unsplash.com/photo-1461896836934-ffe607ba7951?w=800&q=80",
    seller: {
      id: "s1111111-1111-4111-8111-111111111111",
      first_name: "Campus",
      last_name: "Rec",
      role: "admin",
    },
  },
  {
    id: "e5f6a7b8-c9d0-1234-ef01-345678901234",
    seller_id: "s3333333-3333-4333-8333-333333333333",
    title: "Protein Smoothie Voucher",
    description:
      "Redeem at the Rec Center smoothie bar for any large smoothie of your choice.",
    stock: 60,
    cost: 200,
    created_at: "2025-11-05T08:30:00.000Z",
    icon: "local_cafe",
    category: "Food & Drink",
    seller: {
      id: "s3333333-3333-4333-8333-333333333333",
      first_name: "Jordan",
      last_name: "Kim",
      role: "student",
    },
  },
  {
    id: "f6a7b8c9-d0e1-2345-f012-456789012345",
    seller_id: "s1111111-1111-4111-8111-111111111111",
    title: "STL Snapback Cap",
    description:
      "Structured snapback with embroidered logo and adjustable strap. One size fits most.",
    stock: 30,
    cost: 400,
    created_at: "2025-11-08T13:20:00.000Z",
    icon: "checkroom",
    category: "Apparel",
    imageUrl:
      "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800&q=80",
    seller: {
      id: "s1111111-1111-4111-8111-111111111111",
      first_name: "Campus",
      last_name: "Rec",
      role: "admin",
    },
  },
  {
    id: "a7b8c9d0-e1f2-3456-0123-567890123456",
    seller_id: "s2222222-2222-4222-8222-222222222222",
    title: "Gym Towel Set",
    description: "Two-pack of quick-dry microfiber towels with STL monogram.",
    stock: 0,
    cost: 275,
    created_at: "2025-11-10T10:00:00.000Z",
    icon: "dry_cleaning",
    category: "Accessories",
    seller: {
      id: "s2222222-2222-4222-8222-222222222222",
      first_name: "Alex",
      last_name: "Rivera",
      role: "teacher",
    },
  },
  {
    id: "b8c9d0e1-f2a3-4567-1234-678901234567",
    seller_id: "s1111111-1111-4111-8111-111111111111",
    title: "Free Intramural Registration",
    description:
      "Waive registration fees for one sport next semester. Valid for any league.",
    stock: 12,
    cost: 1500,
    created_at: "2025-11-12T15:45:00.000Z",
    icon: "sports",
    category: "Experiences",
    seller: {
      id: "s1111111-1111-4111-8111-111111111111",
      first_name: "Campus",
      last_name: "Rec",
      role: "admin",
    },
  },
  {
    id: "c9d0e1f2-a3b4-5678-2345-789012345678",
    seller_id: "s3333333-3333-4333-8333-333333333333",
    title: "Energy Bar Bundle",
    description: "Pack of five Clif bars in assorted flavors from the Rec store.",
    stock: 35,
    cost: 150,
    created_at: "2025-11-14T07:00:00.000Z",
    icon: "lunch_dining",
    category: "Food & Drink",
    seller: {
      id: "s3333333-3333-4333-8333-333333333333",
      first_name: "Jordan",
      last_name: "Kim",
      role: "student",
    },
  },
];

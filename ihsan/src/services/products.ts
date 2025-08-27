import { supabase } from '../lib/supabaseClient';

export type ProductFilter = {
  readyNow?: boolean;
  category?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
};

export async function fetchProducts(filter: ProductFilter = {}) {
  if (!process.env.EXPO_PUBLIC_SUPABASE_URL) {
    return Array.from({ length: 20 }).map((_, i) => ({
      id: `mock-${i}`,
      name: `Mock Product ${i+1}`,
      image_url: `https://picsum.photos/seed/${i+1}/600/800`,
      price: Math.round(50 + Math.random()*200),
      ready_now: i % 3 === 0,
      group_buy_enabled: i % 4 === 0,
    }));
  }

  let query = supabase.from('products').select('*');
  if (filter.readyNow) query = query.eq('ready_now', true);
  if (filter.minPrice) query = query.gte('price', filter.minPrice);
  if (filter.maxPrice) query = query.lte('price', filter.maxPrice);
  const { data, error } = await query;
  if (error) throw error;
  return data;
}


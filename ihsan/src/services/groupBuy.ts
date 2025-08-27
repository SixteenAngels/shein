import { supabase } from '../lib/supabaseClient';

export type GroupBuy = {
	id: string;
	product_id: string;
	creator_user_id: string;
	min_qty: number;
	max_qty: number;
	tiers: { min: number; max: number; price: number }[];
	status: 'open' | 'successful' | 'failed' | 'closed';
	started_at: string;
	expires_at: string;
	extended_until?: string | null;
};

export async function fetchOpenGroupBuys(limit = 10) {
	const { data, error } = await supabase
		.from('group_buys')
		.select('*')
		.eq('status', 'open')
		.order('started_at', { ascending: false })
		.limit(limit);
	if (error) throw error;
	return data as GroupBuy[];
}

export function getTierPrice(tiers: GroupBuy['tiers'], qty: number) {
	const t = tiers.find((x) => qty >= x.min && qty <= x.max);
	return t ? t.price : undefined;
}

export async function fetchGroupBuy(id: string) {
	const { data, error } = await supabase
		.from('group_buys')
		.select('*')
		.eq('id', id)
		.single();
	if (error) throw error;
	return data as GroupBuy;
}

export async function fetchParticipants(group_buy_id: string) {
	const { data, error } = await supabase
		.from('group_buy_participants')
		.select('*')
		.eq('group_buy_id', group_buy_id)
		.order('created_at', { ascending: true });
	if (error) throw error;
	return data as { id: string; user_id: string; quantity: number; unit_price: number }[];
}

export async function startGroupBuy(input: {
	product_id: string;
	min_qty: number;
	max_qty: number;
	tiers: { min: number; max: number; price: number }[];
	expires_at: string; // dynamic
}) {
	const { data, error } = await supabase
		.from('group_buys')
		.insert({ ...input })
		.select('*')
		.single();
	if (error) throw error;
	return data as GroupBuy;
}

export async function joinGroupBuy(input: {
	group_buy_id: string;
	quantity: number;
	unit_price: number;
}) {
	const { data, error } = await supabase
		.from('group_buy_participants')
		.insert({ ...input })
		.select('*')
		.single();
	if (error) throw error;
	return data;
}
import { NextResponse } from 'next/server';
import { createClient } from "@supabase/supabase-js"

// Use service role to completely bypass RLS so the admin page can pull all users
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function GET(req: Request) {
    try {
        const { data: users, error } = await supabaseAdmin
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            console.error('Supabase Profiles Fetch Error:', error);
            throw error;
        }

        return NextResponse.json({ users });
    } catch (error) {
        console.error('API /admin/users Error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { supabase } from '../../lib/supabase';

export async function POST(req: Request) {
    try {
        const rawBody = await req.text();
        const signature = req.headers.get('x-signature') || '';
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET || '';

        if (!secret) {
            console.error("Missing Lemon Squeezy secret.");
            return NextResponse.json({ error: 'Webhook secret missing' }, { status: 500 });
        }

        // Verify the signature
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            console.error("Invalid Lemon Squeezy signature.");
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
        }

        // Parse the payload securely
        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const eventData = payload.data.attributes;
        const userEmail = eventData.user_email;

        console.log(`[Webhook Details] Processing event: ${eventName} for ${userEmail}`);

        // Handle subscription created / updated / order created
        if (['subscription_created', 'subscription_updated', 'order_created'].includes(eventName)) {

            if (userEmail) {
                // Update Supabase profiles table
                const { error } = await supabase
                    .from('profiles')
                    .update({
                        is_pro: true,
                        daily_credits: 10 // Setting base credits for pro accounts
                    })
                    // Match via email since user_email is universally provided by Lemon Squeezy
                    .eq('email', userEmail);

                if (error) {
                    console.error("Supabase update error:", error);
                    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
                }

                console.log(`[Webhook Success] Upgraded user: ${userEmail}`);
            } else {
                console.error("No user email attached to this event.");
            }
        }

        return NextResponse.json({ received: true }, { status: 200 });
    } catch (err: any) {
        console.error("Webhook processing error:", err.message);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { createClient } from "@supabase/supabase-js"

// Use standard client with service role key to bypass RLS for webhook updates
const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // Fallback if SERVICE_ROLE is missing, though RLS might block it
);

export async function POST(req: Request) {
    try {
        // 1. Extract Webhook Signature
        const signature = req.headers.get('X-Signature') || '';
        const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

        if (!secret) {
            console.error("Missing Lemon Squeezy Secret in .env");
            return NextResponse.json({ error: 'Configuration Error' }, { status: 500 });
        }

        // 2. Read the raw body text for crypto verification
        const rawBody = await req.text();

        // 3. Verify Signature
        const hmac = crypto.createHmac('sha256', secret);
        const digest = Buffer.from(hmac.update(rawBody).digest('hex'), 'utf8');
        const signatureBuffer = Buffer.from(signature, 'utf8');

        if (digest.length !== signatureBuffer.length || !crypto.timingSafeEqual(digest, signatureBuffer)) {
            return NextResponse.json({ error: 'Invalid webhook signature' }, { status: 401 });
        }

        // 4. Parse the verified payload
        const payload = JSON.parse(rawBody);
        const eventName = payload.meta.event_name;
        const obj = payload.data.attributes;

        // Custom Data contains the fields passed via the Checkout Button (e.g. checkout[custom][email])
        const customerEmail = obj.user_email || obj.customer_email || payload.meta.custom_data?.email;
        const subscriptionId = payload.data.id;

        console.log(`[Webhook] Event: ${eventName}, Email: ${customerEmail}`);

        if (!customerEmail) {
            return NextResponse.json({ error: 'No email found in webhook payload' }, { status: 400 });
        }

        // 5. Handle different Lemon Squeezy subscription events
        let isPro = false;

        if (eventName === 'subscription_created' || eventName === 'subscription_resumed' || eventName === 'subscription_updated') {
            isPro = true;
        } else if (eventName === 'subscription_cancelled' || eventName === 'subscription_expired' || eventName === 'subscription_payment_failed') {
            isPro = false;
        }

        // 6. Update Database
        const { error } = await supabaseAdmin
            .from('profiles')
            .update({
                is_pro: isPro,
                subscription_id: isPro ? subscriptionId : null,
            })
            // Since email is unique, we can update by email instead of User ID
            .eq('email', customerEmail.toLowerCase());

        if (error) {
            console.error("[Webhook DB Update Error]:", error);
            // Even if we fail to update the DB, we shouldn't crash the Lemon Squeezy webhook retries 
            // unless it's a critical DB connection issue. We'll return 200 to acknowledge receipt.
        }

        return NextResponse.json({ received: true });

    } catch (error) {
        console.error('Webhook processing error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

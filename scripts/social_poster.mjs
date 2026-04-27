import fetch from 'cross-fetch';
import { TwitterApi } from 'twitter-api-v2';

export async function postToTwitter(text) {
    if (!process.env.TWITTER_API_KEY || !process.env.TWITTER_ACCESS_TOKEN) {
        console.warn("⚠️ Twitter keys missing. Skipping X (Twitter) post.");
        return false;
    }
    try {
        const client = new TwitterApi({
            appKey: process.env.TWITTER_API_KEY,
            appSecret: process.env.TWITTER_API_SECRET,
            accessToken: process.env.TWITTER_ACCESS_TOKEN,
            accessSecret: process.env.TWITTER_ACCESS_SECRET,
        });

        // 트위터 글자수 제한(280자) 처리
        const truncatedText = text.length > 275 ? text.substring(0, 275) + '...' : text;
        const { data } = await client.v2.tweet(truncatedText);
        console.log(`✅ Posted to Twitter (X) successfully. ID: ${data.id}`);
        return true;
    } catch (e) {
        console.error("❌ Failed to post to Twitter:", e?.message || e);
        return false;
    }
}

export async function postToThreads(text) {
    const userId = process.env.THREADS_USER_ID;
    const accessToken = process.env.THREADS_ACCESS_TOKEN;
    if (!userId || !accessToken) {
        console.warn("⚠️ Threads tokens missing. Skipping Threads post.");
        return false;
    }
    
    try {
        // Step 1: Create a Threads media container for text
        const containerUrl = `https://graph.threads.net/v1.0/${userId}/threads?media_type=TEXT&text=${encodeURIComponent(text)}&access_token=${accessToken}`;
        const containerRes = await fetch(containerUrl, { method: 'POST' });
        const containerData = await containerRes.json();
        
        if (!containerData.id) {
            console.error("❌ Threads container creation failed:", containerData);
            return false;
        }

        // Step 2: Publish the container
        const publishUrl = `https://graph.threads.net/v1.0/${userId}/threads_publish?creation_id=${containerData.id}&access_token=${accessToken}`;
        const publishRes = await fetch(publishUrl, { method: 'POST' });
        const publishData = await publishRes.json();
        
        if (!publishData.id) {
            console.error("❌ Threads publish failed:", publishData);
            return false;
        }

        console.log(`✅ Posted to Threads successfully. ID: ${publishData.id}`);
        return true;
    } catch (e) {
        console.error("❌ Failed to post to Threads:", e?.message || e);
        return false;
    }
}

export async function broadcastToSocialMedia(text) {
    console.log("📢 Broadcasting to Social Media...");
    // 딜레이를 주어 API Rate Limit 방지
    await postToTwitter(text);
    await new Promise(res => setTimeout(res, 2000));
    await postToThreads(text);
}

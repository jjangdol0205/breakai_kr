import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export async function POST() {
    try {
        console.log("Admin triggering O'Neil Screener Action...");

        // Execute the Node.js script
        // Providing maxBuffer to prevent overflow if output is large
        const { stdout, stderr } = await execPromise('node scripts/oneil_screener.mjs', {
            maxBuffer: 1024 * 1024 * 10
        });

        console.log("Screener STDOUT:", stdout);
        if (stderr) console.error("Screener STDERR:", stderr);

        if (stdout.includes("Already found today's pick")) {
            return NextResponse.json({ success: true, message: "Skipped: Today's pick already exists." });
        }

        return NextResponse.json({ success: true, message: "Screener ran successfully. Check the Picks dashboard." });

    } catch (error) {
        console.error("Failed to run screener:", error);
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

// Read env
const envPath = path.resolve(process.cwd(), '.env.local');
const targetPath = fs.existsSync(envPath) ? envPath : path.resolve(process.cwd(), '.env');

if (!fs.existsSync(targetPath)) {
    console.error("No .env file");
    process.exit(1);
}

const envContent = fs.readFileSync(targetPath, 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
        const key = match[1].trim();
        let value = match[2].trim();
        if ((value.startsWith('"') && value.endsWith('"'))) value = value.slice(1, -1);
        env[key] = value;
    }
});

const serviceAccount = {
    projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    clientEmail: env.FIREBASE_CLIENT_EMAIL,
    privateKey: env.FIREBASE_PRIVATE_KEY ? env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n') : undefined,
};

if (!serviceAccount.clientEmail) {
    console.error("Missing credentials");
    process.exit(1);
}

// Init without specific bucket to allow listing
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

async function configure() {
    console.log("Listing buckets...");
    const [buckets] = await admin.storage().getBuckets().catch(e => {
        console.error("List failed:", e.message);
        process.exit(1);
    });

    console.log("Found buckets:", buckets.map(b => b.name));

    if (buckets.length === 0) {
        console.error("No buckets found in project.");
        return;
    }

    for (const bucket of buckets) {
        console.log(`Setting CORS for bucket: ${bucket.name}`);
        await bucket.setCorsConfiguration([
            {
                origin: ["*"],
                method: ["GET", "PUT", "POST", "DELETE", "HEAD", "OPTIONS"],
                responseHeader: ["Content-Type", "x-goog-resumable"],
                maxAgeSeconds: 3600
            }
        ]);
        console.log(`SUCCESS: CORS configured for ${bucket.name}`);
    }
}

configure().catch(e => {
    console.error("FATAL:", e.message);
    process.exit(1);
});

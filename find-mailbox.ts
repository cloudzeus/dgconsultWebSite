import dotenv from "dotenv";
dotenv.config();

import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";

async function findMailboxes() {
    console.log("🔍 Searching for available mailboxes in your Office 365 tenant...\n");

    try {
        const tenantId = process.env.TENANT_ID!;
        const clientId = process.env.APPLICATION_ID!;
        const clientSecret = process.env.CLIENT_SECRET_VALUE!;

        const credential = new ClientSecretCredential(tenantId, clientId, clientSecret);

        const client = Client.initWithMiddleware({
            authProvider: {
                getAccessToken: async () => {
                    const token = await credential.getToken("https://graph.microsoft.com/.default");
                    return token?.token || "";
                },
            },
        });

        console.log("📧 Trying to access com@dgconsult.gr...\n");

        try {
            const user = await client.api("/users/com@dgconsult.gr").select("displayName,mail,userPrincipalName").get();
            console.log("✅ Found mailbox:");
            console.log(`   Display Name: ${user.displayName}`);
            console.log(`   Email: ${user.mail || user.userPrincipalName}`);
            console.log(`   UPN: ${user.userPrincipalName}\n`);

            console.log("💡 This mailbox exists! Update .env with:");
            console.log(`   SHARED_MAILBOX_ADDRESS=${user.mail || user.userPrincipalName}`);
        } catch (error: any) {
            if (error.statusCode === 404) {
                console.log("❌ com@dgconsult.gr does not exist in your tenant.\n");
                console.log("📝 Please provide the correct email address that exists in your Office 365 tenant.");
                console.log("   Common formats:");
                console.log("   - yourname@dgconsult.gr");
                console.log("   - info@dgconsult.gr");
                console.log("   - contact@dgconsult.gr\n");
            } else if (error.statusCode === 403) {
                console.log("⚠️  Permission denied. Your app needs 'User.Read.All' permission.");
            } else {
                throw error;
            }
        }

    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

findMailboxes();

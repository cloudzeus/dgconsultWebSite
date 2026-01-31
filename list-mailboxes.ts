import dotenv from "dotenv";
dotenv.config();

import { Client } from "@microsoft/microsoft-graph-client";
import { ClientSecretCredential } from "@azure/identity";

async function listMailboxes() {
    console.log("📬 Listing available mailboxes in your Office 365 tenant...\n");

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

        // List all users
        console.log("📧 Available mailboxes:\n");
        const users = await client.api("/users").select("displayName,mail,userPrincipalName").get();

        users.value.forEach((user: any, index: number) => {
            console.log(`${index + 1}. ${user.displayName}`);
            console.log(`   Email: ${user.mail || user.userPrincipalName}`);
            console.log(`   UPN: ${user.userPrincipalName}\n`);
        });

        console.log(`\n✅ Found ${users.value.length} mailbox(es)`);
        console.log("\n💡 Update your .env file with SHARED_MAILBOX_ADDRESS set to one of the emails above.");

    } catch (error) {
        console.error("❌ Error listing mailboxes:", error);
        process.exit(1);
    }
}

listMailboxes();

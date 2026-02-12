import { db } from "./db";
import { teamMembers, channels } from "@shared/schema";

const ADMIN_ID = "cef223ad-1909-4c9b-bdee-239aa5e99387";

const USER_IDS: Record<string, string> = {
  "admin@suprans.in": "cef223ad-1909-4c9b-bdee-239aa5e99387",
  "abhinandan@suprans.in": "10849777-2824-4594-a753-a4e4cf584d2d",
  "aditya@suprans.in": "16a9a476-ef43-45f8-9461-a4ebc19299c7",
  "akansha@suprans.in": "122fac6c-c09d-4116-a97f-84c7799f5bce",
  "akshay@suprans.in": "67fc8860-99cf-41d2-8dc0-78e534f468bc",
  "babita@suprans.in": "198af834-c248-4a50-8d59-e846e6230b72",
  "garima@suprans.in": "aa117630-78b3-44fe-bb56-05faf93d0db2",
  "gaurav@suprans.in": "7e2142fa-2ecd-449c-bf6e-5c99836602b2",
  "himanshu@suprans.in": "81ddd550-8924-4199-a3f7-4110d4fd8e03",
  "jyoti@suprans.in": "09ae056a-8729-4f04-b94d-3f825fc4116e",
  "kartik@suprans.in": "63b604ca-8d29-4f51-93ee-88dda0874d01",
  "krish@suprans.in": "137a7f6b-5265-4d03-8d9a-157db8fd0264",
  "naveen@suprans.in": "86ea1c4e-6be5-49c0-9848-f9b5f3368123",
  "neetu@suprans.in": "b9bfce80-bbe1-47a7-a769-9bbde8cb71f9",
  "nitin@suprans.in": "41dcf59d-2828-4b97-87ee-a812ad5dfe41",
  "parth@suprans.in": "c17a641e-4c98-4510-93ce-5a9491fcc5a3",
  "payal@suprans.in": "530e57b8-a80b-4642-94a0-067ac6b87a54",
  "prachi@suprans.in": "9c5c1b08-7933-4ca5-ac50-7ba86d97ff41",
  "punit@suprans.in": "13212822-2d95-4e37-b4b5-39880adfe008",
  "rudraksh@suprans.in": "05473245-7abe-469e-b437-8bc1b45cc73f",
  "sahil@suprans.in": "90c03228-5a7c-4f6d-aeb7-bc167516a181",
  "simran@suprans.in": "539a6d73-8b4d-4178-a7b8-fa17fbc92e42",
  "sumit@suprans.in": "1aa7fda8-8d51-40cf-8fd1-6a8f813e1c39",
  "sunny@suprans.in": "004f8ad4-f813-41e4-9303-f2fa1e14b528",
  "vikash@suprans.in": "8b96b097-7624-4558-9809-53cc8ed01142",
  "yash@suprans.in": "d55bb655-8d2d-4148-afec-a547d512d3c5",
};

const ALL_TEAMS = [
  "sales", "travel-sales", "travel-operations", "travel-accounts",
  "china-import-sales", "china-import-operations",
  "dropshipping-sales", "dropshipping-operations",
  "llc-sales", "llc-operations",
  "events", "hr", "training", "media", "marketing", "admin-it",
  "faire-order-fulfilment", "faire-products",
];

const TEAM_CHANNEL_NAMES: Record<string, string> = {
  "sales": "Sales",
  "travel-sales": "Travel - Sales",
  "travel-operations": "Travel - Operations",
  "travel-accounts": "Travel - Accounts",
  "china-import-sales": "Import From China - Sales",
  "china-import-operations": "Import From China - Ops",
  "dropshipping-sales": "USA Dropshipping - Sales",
  "dropshipping-operations": "USA Dropshipping - Ops",
  "llc-sales": "USA LLC Formation - Sales",
  "llc-operations": "USA LLC Formation - Ops",
  "events": "Events",
  "hr": "HR",
  "training": "Training",
  "media": "Media",
  "marketing": "Marketing",
  "admin-it": "Admin IT",
  "faire-order-fulfilment": "Faire Order Fulfilment",
  "faire-products": "Faire Products",
};

interface MemberEntry {
  userId: string;
  role: "manager" | "executive";
}

const TEAM_MEMBERS: Record<string, MemberEntry[]> = {
  "sales": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["abhinandan@suprans.in"], role: "executive" },
    { userId: USER_IDS["simran@suprans.in"], role: "executive" },
    { userId: USER_IDS["sumit@suprans.in"], role: "executive" },
    { userId: USER_IDS["punit@suprans.in"], role: "executive" },
    { userId: USER_IDS["sunny@suprans.in"], role: "executive" },
    { userId: USER_IDS["akshay@suprans.in"], role: "executive" },
    { userId: USER_IDS["garima@suprans.in"], role: "executive" },
    { userId: USER_IDS["sahil@suprans.in"], role: "executive" },
    { userId: USER_IDS["yash@suprans.in"], role: "executive" },
    { userId: USER_IDS["payal@suprans.in"], role: "executive" },
    { userId: USER_IDS["parth@suprans.in"], role: "executive" },
  ],
  "travel-sales": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["abhinandan@suprans.in"], role: "executive" },
    { userId: USER_IDS["simran@suprans.in"], role: "executive" },
    { userId: USER_IDS["sumit@suprans.in"], role: "executive" },
    { userId: USER_IDS["punit@suprans.in"], role: "executive" },
    { userId: USER_IDS["sunny@suprans.in"], role: "executive" },
    { userId: USER_IDS["akshay@suprans.in"], role: "executive" },
  ],
  "travel-operations": [
    { userId: USER_IDS["babita@suprans.in"], role: "manager" },
    { userId: USER_IDS["naveen@suprans.in"], role: "executive" },
    { userId: USER_IDS["vikash@suprans.in"], role: "executive" },
  ],
  "travel-accounts": [
    { userId: USER_IDS["jyoti@suprans.in"], role: "manager" },
    { userId: USER_IDS["nitin@suprans.in"], role: "executive" },
  ],
  "china-import-sales": [
    { userId: USER_IDS["garima@suprans.in"], role: "manager" },
    { userId: USER_IDS["sahil@suprans.in"], role: "executive" },
    { userId: USER_IDS["yash@suprans.in"], role: "executive" },
  ],
  "china-import-operations": [
    { userId: USER_IDS["kartik@suprans.in"], role: "manager" },
    { userId: USER_IDS["krish@suprans.in"], role: "executive" },
  ],
  "dropshipping-sales": [
    { userId: USER_IDS["payal@suprans.in"], role: "manager" },
    { userId: USER_IDS["parth@suprans.in"], role: "executive" },
    { userId: USER_IDS["rudraksh@suprans.in"], role: "executive" },
  ],
  "dropshipping-operations": [
    { userId: USER_IDS["prachi@suprans.in"], role: "manager" },
  ],
  "llc-sales": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["punit@suprans.in"], role: "executive" },
    { userId: USER_IDS["sunny@suprans.in"], role: "executive" },
  ],
  "llc-operations": [
    { userId: USER_IDS["babita@suprans.in"], role: "manager" },
    { userId: USER_IDS["naveen@suprans.in"], role: "executive" },
  ],
  "events": [
    { userId: USER_IDS["gaurav@suprans.in"], role: "manager" },
    { userId: USER_IDS["akansha@suprans.in"], role: "executive" },
  ],
  "hr": [
    { userId: USER_IDS["neetu@suprans.in"], role: "manager" },
    { userId: USER_IDS["jyoti@suprans.in"], role: "executive" },
  ],
  "training": [
    { userId: USER_IDS["neetu@suprans.in"], role: "manager" },
  ],
  "media": [
    { userId: USER_IDS["aditya@suprans.in"], role: "manager" },
    { userId: USER_IDS["rudraksh@suprans.in"], role: "executive" },
  ],
  "marketing": [
    { userId: USER_IDS["aditya@suprans.in"], role: "manager" },
  ],
  "admin-it": [],
  "faire-order-fulfilment": [
    { userId: USER_IDS["kartik@suprans.in"], role: "manager" },
    { userId: USER_IDS["krish@suprans.in"], role: "executive" },
  ],
  "faire-products": [
    { userId: USER_IDS["kartik@suprans.in"], role: "manager" },
  ],
};

export async function seedTeamMembers() {
  const existingMembers = await db.select().from(teamMembers).limit(1);
  if (existingMembers.length === 0) {
    console.log("Seeding team members...");

    const allMemberRows: { teamId: string; userId: string; role: string }[] = [];

    for (const teamId of ALL_TEAMS) {
      allMemberRows.push({ teamId, userId: ADMIN_ID, role: "manager" });

      const members = TEAM_MEMBERS[teamId] || [];
      for (const member of members) {
        allMemberRows.push({ teamId, userId: member.userId, role: member.role });
      }
    }

    await db.insert(teamMembers).values(allMemberRows);
    console.log(`Seeded ${allMemberRows.length} team member records.`);
  } else {
    console.log("Team members already seeded, skipping...");
  }

  const existingChannels = await db.select().from(channels);
  if (existingChannels.length < ALL_TEAMS.length) {
    console.log("Seeding missing channels...");
    const channelRows = ALL_TEAMS.map(teamId => ({
      teamId,
      name: TEAM_CHANNEL_NAMES[teamId] || teamId,
      description: `Team channel for ${TEAM_CHANNEL_NAMES[teamId] || teamId}`,
    }));

    for (const row of channelRows) {
      await db.insert(channels).values(row).onConflictDoNothing();
    }
    console.log(`Seeded channels (${channelRows.length} teams, skipped duplicates).`);
  } else {
    console.log("Channels already seeded, skipping...");
  }
}

import { supabase } from "./db";

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
  "nitin@suprans.in": "cb0e13bf-1b8d-4b5f-b9e3-6c6f4c85d1a4",
  "payal@suprans.in": "cffc6d5a-d69b-4e99-a3fc-cc9f4d1bb36d",
  "prachi@suprans.in": "dd5f18a6-1d75-42c0-bce3-01fac08c64f7",
  "rudraksh@suprans.in": "3e3a0a60-8f62-4bd5-8f03-3f3c5ebadea5",
  "sahil@suprans.in": "7fde9c6b-cfb9-4063-bc40-70ab38d2fb97",
  "simran@suprans.in": "9e55e7b4-4d31-4e01-90e6-2bf8fd42ad74",
  "sumit@suprans.in": "5a207741-ec1e-4baf-a3e0-ba0e0fc7e9c6",
  "sunny@suprans.in": "3f478e6c-39d0-4fc8-b5d5-6e4f78f2f10d",
  "vikash@suprans.in": "8bc42a05-8e36-4db1-9f4c-ef4c3f1e0678",
};

const ALL_TEAMS = [
  "sales-consultation", "sales-mentorship", "sales-travel", "sales-events",
  "sales-franchise", "sales-imports", "hr", "accounts", "operations",
  "marketing", "tech", "admin", "events-management", "travel-management",
  "faire-orders", "faire-products", "llc", "crm",
];

const TEAM_CHANNEL_NAMES: Record<string, string> = {
  "sales-consultation": "Sales - Consultation",
  "sales-mentorship": "Sales - Mentorship",
  "sales-travel": "Sales - Travel",
  "sales-events": "Sales - Events",
  "sales-franchise": "Sales - Franchise",
  "sales-imports": "Sales - Imports",
  "hr": "HR",
  "accounts": "Accounts",
  "operations": "Operations",
  "marketing": "Marketing",
  "tech": "Tech",
  "admin": "Admin",
  "events-management": "Events Management",
  "travel-management": "Travel Management",
  "faire-orders": "Faire Orders",
  "faire-products": "Faire Products",
  "llc": "LLC",
  "crm": "CRM",
};

const TEAM_MEMBERS: Record<string, { userId: string; role: string }[]> = {
  "sales-consultation": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["akansha@suprans.in"], role: "executive" },
    { userId: USER_IDS["prachi@suprans.in"], role: "executive" },
  ],
  "sales-mentorship": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["simran@suprans.in"], role: "executive" },
  ],
  "sales-travel": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["rudraksh@suprans.in"], role: "executive" },
  ],
  "sales-events": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["sumit@suprans.in"], role: "executive" },
    { userId: USER_IDS["sunny@suprans.in"], role: "executive" },
  ],
  "sales-franchise": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["neetu@suprans.in"], role: "executive" },
  ],
  "sales-imports": [
    { userId: USER_IDS["sahil@suprans.in"], role: "manager" },
    { userId: USER_IDS["vikash@suprans.in"], role: "executive" },
  ],
  "hr": [
    { userId: USER_IDS["garima@suprans.in"], role: "manager" },
    { userId: USER_IDS["babita@suprans.in"], role: "executive" },
  ],
  "accounts": [
    { userId: USER_IDS["nitin@suprans.in"], role: "manager" },
    { userId: USER_IDS["payal@suprans.in"], role: "executive" },
  ],
  "operations": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["gaurav@suprans.in"], role: "executive" },
  ],
  "marketing": [
    { userId: USER_IDS["aditya@suprans.in"], role: "manager" },
    { userId: USER_IDS["naveen@suprans.in"], role: "executive" },
  ],
  "tech": [
    { userId: USER_IDS["krish@suprans.in"], role: "manager" },
    { userId: USER_IDS["abhinandan@suprans.in"], role: "executive" },
  ],
  "admin": [
    { userId: USER_IDS["garima@suprans.in"], role: "manager" },
  ],
  "events-management": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["sumit@suprans.in"], role: "executive" },
  ],
  "travel-management": [
    { userId: USER_IDS["himanshu@suprans.in"], role: "manager" },
    { userId: USER_IDS["rudraksh@suprans.in"], role: "executive" },
  ],
  "faire-orders": [
    { userId: USER_IDS["kartik@suprans.in"], role: "manager" },
    { userId: USER_IDS["krish@suprans.in"], role: "executive" },
  ],
  "faire-products": [
    { userId: USER_IDS["kartik@suprans.in"], role: "manager" },
  ],
  "llc": [],
  "crm": [],
};

export async function seedTeamMembers() {
  const { data: existingMembers } = await supabase.from('team_members').select('id').limit(1);
  if (!existingMembers || existingMembers.length === 0) {
    console.log("Seeding team members...");

    const { data: existingUsers } = await supabase.from('users').select('id');
    const existingUserIds = new Set((existingUsers ?? []).map((u: any) => u.id));

    if (existingUserIds.size === 0) {
      console.log("No users found in database - skipping team member seeding (create users first).");
      return;
    }

    const allMemberRows: { team_id: string; user_id: string; role: string }[] = [];

    for (const teamId of ALL_TEAMS) {
      if (existingUserIds.has(ADMIN_ID)) {
        allMemberRows.push({ team_id: teamId, user_id: ADMIN_ID, role: "manager" });
      }

      const members = TEAM_MEMBERS[teamId] || [];
      for (const member of members) {
        if (existingUserIds.has(member.userId)) {
          allMemberRows.push({ team_id: teamId, user_id: member.userId, role: member.role });
        }
      }
    }

    if (allMemberRows.length > 0) {
      const { error } = await supabase.from('team_members').insert(allMemberRows);
      if (error) {
        console.error("Error seeding team members:", error.message);
      } else {
        console.log(`Seeded ${allMemberRows.length} team member records.`);
      }
    } else {
      console.log("No matching users found for team member seeding.");
    }
  } else {
    console.log("Team members already seeded, skipping...");
  }

  const { data: existingChannels } = await supabase.from('channels').select('id');
  if (!existingChannels || existingChannels.length < ALL_TEAMS.length) {
    console.log("Seeding missing channels...");
    for (const teamId of ALL_TEAMS) {
      const { error } = await supabase.from('channels').upsert({
        team_id: teamId,
        name: TEAM_CHANNEL_NAMES[teamId] || teamId,
        description: `Team channel for ${TEAM_CHANNEL_NAMES[teamId] || teamId}`,
      }, { onConflict: 'team_id' });
      if (error) {
        console.log(`Channel for ${teamId}: ${error.message}`);
      }
    }
    console.log(`Seeded channels (${ALL_TEAMS.length} teams, skipped duplicates).`);
  } else {
    console.log("Channels already seeded, skipping...");
  }
}

import { Inngest } from "inngest";
import { db, users } from "../db/schema";
import { eq } from "drizzle-orm";

export const inngest = new Inngest({
  id: "octo",
});

export const createUser = inngest.createFunction(
  {
    id: "create-user",
    triggers: [{ event: "clerk/user.created" }],
  },
  async ({ event }) => {
    const { id, email_addresses, first_name, last_name } = event.data;

    const name = `${first_name || ""} ${last_name || ""}`.trim();
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      throw new Error("Missing Clerk user ID or email");
    }

    await db
      .insert(users)
      .values({
        clerkId: id,
        name,
        email,
      })
      .onConflictDoNothing();
  },
);

export const updateUser = inngest.createFunction(
  {
    id: "update-user",
    triggers: [{ event: "clerk/user.updated" }],
  },
  async ({ event }) => {
    const { id, email_addresses, first_name, last_name } = event.data;

    const updatedName = `${first_name || ""} ${last_name || ""}`.trim();
    const email = email_addresses?.[0]?.email_address;

    if (!id || !email) {
      throw new Error("Missing Clerk user ID or email");
    }

    await db
      .update(users)
      .set({
        name: updatedName,
        email,
      })
      .where(eq(users.clerkId, id));
  },
);

export const deleteUser = inngest.createFunction(
  {
    id: "delete-user",
    triggers: [{ event: "clerk/user.deleted" }],
  },
  async ({ event }) => {
    const { id } = event.data;

    if (!id) {
      throw new Error("Missing Clerk user ID");
    }

    await db.delete(users).where(eq(users.clerkId, id));
  },
);

export const functions = [createUser, updateUser, deleteUser];

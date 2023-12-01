import "$std/dotenv/load.ts";
import PocketBase from "pb";

/**
 * Get PocketBase client logged in with admin-credentials. based on variables from `.env`.
 */
export async function getAdminPocketBase(): Promise<PocketBase | null> {
  try {
    const pb: PocketBase = new PocketBase(Deno.env.get("PB_URL") as string);

    const username = Deno.env.get("PB_USERNAME_ADMIN") ?? "";
    const password = Deno.env.get("PB_PASSWORD_ADMIN") ?? "";

    await pb.admins.authWithPassword(
      username,
      password,
    );

    return pb;
  } catch (error) {
    console.error(error);

    return null;
  }
}

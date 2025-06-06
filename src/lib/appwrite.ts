import { Client, Databases, Storage, ID, Account } from "appwrite";

const client = new Client()
  .setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!)
  .setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);

export const databases = new Databases(client);
export const storage = new Storage(client);
export { ID };

export async function getLoggedInUser() {
  try {
    const account = new Account(client);
    return await account.get();
  } catch {
    return null;
  }
}
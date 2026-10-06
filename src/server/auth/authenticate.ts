import "server-only";
import { hashPassword, verifyPassword } from "@/server/auth/password";
import { db } from "@/server/db";

let dummyHash: Promise<string> | undefined;

/** Checks credentials; takes about as long for unknown emails, so responses do not reveal which accounts exist. */
export async function authenticate(
  email: string,
  password: string,
): Promise<{ id: string } | null> {
  const user = await db.user.findUnique({
    where: { email },
    select: { id: true, passwordHash: true },
  });
  if (!user) {
    dummyHash ??= hashPassword("granabank-timing-equalizer");
    await verifyPassword(await dummyHash, password);
    return null;
  }
  return (await verifyPassword(user.passwordHash, password)) ? { id: user.id } : null;
}

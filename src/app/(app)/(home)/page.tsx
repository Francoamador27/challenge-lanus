import { requireUser } from "@/server/auth/current-user";

/** Home screen. */
export default async function HomePage() {
  const user = await requireUser();
  return <h1 className="text-xl font-semibold text-ink">{user.displayName}</h1>;
}

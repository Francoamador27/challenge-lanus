import type { Metadata } from "next";
import { CardCarousel } from "@/features/cards/card-carousel";
import { HomeHeader } from "@/features/home/home-header";
import { LatestMovements } from "@/features/movements/components/latest-movements";
import { requireUser } from "@/server/auth/current-user";
import { listCards } from "@/server/cards/cards-service";
import { listMovements } from "@/server/movements/movements-service";

export const metadata: Metadata = { title: "Inicio" };

const LATEST_MOVEMENTS = 5;

/** Home screen: greeting, cards carousel and the latest movements. */
export default async function HomePage() {
  const user = await requireUser();
  const [cards, latest] = await Promise.all([
    listCards(user.id),
    listMovements(user.id, { limit: LATEST_MOVEMENTS }),
  ]);
  return (
    <div className="flex flex-col gap-8">
      <HomeHeader displayName={user.displayName} />
      <CardCarousel cards={cards} />
      <LatestMovements movements={latest.data} />
    </div>
  );
}

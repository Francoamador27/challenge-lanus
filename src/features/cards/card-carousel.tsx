import { CreditCard } from "lucide-react";
import { EmptyState } from "@/components/ui/empty-state";
import type { CardDTO } from "@/shared/cards";
import { BankCard } from "./bank-card";

/** Horizontally scrollable, snap-aligned row of the user's cards; the next card peeks in. */
export function CardCarousel({ cards }: { cards: CardDTO[] }) {
  if (cards.length === 0) {
    return (
      <EmptyState icon={<CreditCard className="size-6" />} title="Todavía no tenés tarjetas" />
    );
  }
  return (
    <section
      aria-label="Tus tarjetas"
      tabIndex={0}
      className="-mx-6 flex snap-x snap-mandatory scroll-px-6 [scrollbar-width:none] gap-4 overflow-x-auto px-6 pb-2"
    >
      {cards.map((card, index) => (
        <div key={card.id} className="w-[85%] shrink-0 snap-start">
          <BankCard card={card} themeIndex={index} />
        </div>
      ))}
    </section>
  );
}

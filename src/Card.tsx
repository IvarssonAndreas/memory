import { FC } from "react";

export const CARD_VARIANTS = ["pink", "green", "blue", "yellow", "red", "orange", "sky", "fuchsia"] as const;
export type CardVariant = (typeof CARD_VARIANTS)[number];

type CardProps = {
  variant: CardVariant;
  status: "hidden" | "picked-current-round" | "collected-card-variant";
  isRoundFinished: boolean;
  position: number;
  pickCard: () => void;
};

export const Card: FC<CardProps> = ({ variant, pickCard, position, status, isRoundFinished }) => {
  const isPickedCurrentRound = status === "picked-current-round";
  const isCollectedCardVariant = status === "collected-card-variant";
  const isCardClickable = !isPickedCurrentRound && !isRoundFinished;

  return (
    <button
      aria-hidden={isCollectedCardVariant}
      onClick={() => isCardClickable && pickCard()}
      className={`aspect-square w-full scale-95  rounded-md border-0 transition duration-100 ease-in-out focus-visible:outline-none focus-visible:ring focus-visible:ring-gray-600 ${(() => {
        switch (status) {
          case "collected-card-variant":
            return "invisible";
          case "picked-current-round":
            return `!scale-105  cursor-not-allowed ${cardVariantToCardColor[variant]}`;
          case "hidden":
            if (isRoundFinished) {
              return `${HIDDEN_CARD_COLOR} cursor-not-allowed opacity-40`;
            }
            return `${HIDDEN_CARD_COLOR} transition duration-200 ease-in-out`;
          default:
            return exhaustiveStatusCheck(status);
        }
      })()}`}
    >
      <span className="sr-only">
        Position: {position} {isPickedCurrentRound ? variant : "Hidden"}
      </span>
    </button>
  );
};

const exhaustiveStatusCheck = (status: never) => {
  throw new Error(`Unhandled status: ${status}`);
};

const HIDDEN_CARD_COLOR = "bg-gray-300";
export const cardVariantToCardColor: Record<CardVariant, `bg-${string}-${number}`> = {
  pink: "bg-pink-400",
  green: "bg-green-900",
  blue: "bg-blue-600",
  yellow: "bg-yellow-400",
  red: "bg-red-700",
  orange: "bg-orange-500",
  sky: "bg-sky-500",
  fuchsia: "bg-fuchsia-600",
};

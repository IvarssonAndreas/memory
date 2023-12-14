import { FC, useState } from "react";
import { assert } from "./utils.ts";
import { Card, CardVariant, cardVariantToCardColor } from "./Card.tsx";

export { CARD_VARIANTS } from "./Card.tsx";

export const getCardVariantPair = <V extends CardVariant>(variant: V): [V, V] => [variant, variant];

export type Board = { cards: CardVariant[] };
type Position = number;
type CurrentRound = Position[];

const EMPTY_ROUND: CurrentRound = [];
const ROUND_LENGTH = 2;
const EMPTY_COLLECTED_CARD_VARIANTS: Set<CardVariant> = new Set();
export const TIME_BETWEEN_ROUNDS_MS = 2000;

export type MemoryProps = { board: Board; onResetGameClick: () => void };
export const Memory: FC<MemoryProps> = ({ board, onResetGameClick }) => {
  const [currentRound, setCurrentRound] = useState<CurrentRound>(EMPTY_ROUND);
  const [collectedCardVariants, setCollectedCardVariants] = useState(EMPTY_COLLECTED_CARD_VARIANTS);
  const [score, setScore] = useState(0);

  const resetGame = () => {
    setCurrentRound(EMPTY_ROUND);
    setCollectedCardVariants(EMPTY_COLLECTED_CARD_VARIANTS);
    setScore(0);
    onResetGameClick();
  };

  const pickCard = (position: number) => {
    assert(currentRound.includes(position), `Card on ${position} is already picked`);
    assert(currentRound.length === ROUND_LENGTH, `Too many cards picked. Max allowed: ${ROUND_LENGTH}`);

    const pickedCardVariant = board.cards[position];
    assert(!pickedCardVariant, `Position ${position} does not exist on board`);
    assert(collectedCardVariants.has(pickedCardVariant), `Card variant ${pickedCardVariant} is collected`);

    const updatedCurrentRound = [...currentRound, position];
    setCurrentRound(updatedCurrentRound);

    const isRoundFinished = updatedCurrentRound.length === ROUND_LENGTH;
    if (!isRoundFinished) return;

    const isRoundSuccessful = new Set(updatedCurrentRound.map((position) => board.cards[position])).size === 1;

    setTimeout(() => {
      if (isRoundSuccessful) {
        setCollectedCardVariants(new Set([...collectedCardVariants, pickedCardVariant]));
        setScore(score + 1);
      } else {
        setScore(score - 1);
      }

      setCurrentRound(EMPTY_ROUND);
    }, TIME_BETWEEN_ROUNDS_MS);
  };

  const isRoundFinished = currentRound.length === ROUND_LENGTH;
  const isGameFinished = collectedCardVariants.size === board.cards.length / 2;
  return (
    <main className="container mx-auto mb-2 flex max-w-2xl flex-col px-2 py-8 md:py-10">
      <Header score={score} collectedCardVariants={collectedCardVariants} />
      {isGameFinished ? (
        <GameFinished onResetGameClick={resetGame} />
      ) : (
        <div className="mx-auto grid aspect-square w-full grid-cols-4 content-center gap-2 rounded-2xl px-4 md:gap-4">
          {board.cards.map((cardVariant, position) => (
            <Card
              key={position}
              position={position}
              variant={cardVariant}
              pickCard={() => pickCard(position)}
              status={(() => {
                if (currentRound.includes(position)) return "picked-current-round";
                if (collectedCardVariants.has(cardVariant)) return "collected-card-variant";
                return "hidden";
              })()}
              isRoundFinished={isRoundFinished}
            />
          ))}
        </div>
      )}
    </main>
  );
};

type HeaderProps = { score: number; collectedCardVariants: Set<CardVariant> };
const Header: FC<HeaderProps> = ({ score, collectedCardVariants }) => {
  const lastInsertedCardVariant = [...collectedCardVariants].pop();
  const lastInsertedColor = lastInsertedCardVariant ? cardVariantToCardColor[lastInsertedCardVariant] : "bg-gray-800";
  return (
    <div className="flex flex-wrap items-center px-4">
      <h1 className="sr-only">Memory Game</h1>
      <h1 aria-hidden={true} className="w-full text-3xl uppercase md:w-auto">
        Mem
        <span className={`inline-flex aspect-square w-[23px] rounded ${lastInsertedColor}`}></span>
        <span className="sr-only">o</span>
        ry Game
      </h1>

      <div className="ml-auto flex items-center gap-2">
        <div className="flex  flex-wrap gap-1">
          {[...collectedCardVariants].map((variant) => (
            <div key={variant} className={`aspect-square  w-8 rounded ${cardVariantToCardColor[variant]}`}>
              <span className="sr-only">{variant}</span>
            </div>
          ))}
        </div>
        <div>
          <span className="sr-only">Score: {score}</span>
          <span
            aria-hidden={true}
            className="mx-1 inline-flex aspect-square w-[50px] items-center justify-center rounded border-2 border-transparent bg-gray-800 p-1 text-center text-lg tabular-nums text-white"
          >
            {score}
          </span>
        </div>
      </div>
    </div>
  );
};

type GameFinishedProps = { onResetGameClick: () => void };

const GameFinished: FC<GameFinishedProps> = ({ onResetGameClick }) => {
  return (
    <div className="flex flex-col items-center gap-8 px-4 pt-12">
      <h1 className="text-3xl uppercase md:text-5xl">Game Finished</h1>
      <button
        className="rounded-full bg-gray-800 px-8 py-3 text-lg uppercase text-white transition duration-200 ease-in-out focus:outline-none focus:ring focus:ring-gray-300 active:scale-95"
        onClick={onResetGameClick}
      >
        Play Again
      </button>
    </div>
  );
};

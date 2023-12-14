import { Memory, getCardVariantPair, Board, CARD_VARIANTS } from "./Memory.tsx";

import { useState } from "react";
import { shuffle } from "./utils.ts";

const initBoard = (): Board => ({
  cards: shuffle(CARD_VARIANTS.map(getCardVariantPair).flatMap((pair) => pair)),
});

export const App = () => {
  const [board, setBoard] = useState(initBoard);
  return <Memory board={board} onResetGameClick={() => setBoard(initBoard)} />;
};

import { vi, test, expect, beforeEach } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Board, getCardVariantPair, Memory, TIME_BETWEEN_ROUNDS_MS } from "./Memory.tsx";

beforeEach(() => {
  void vi.useFakeTimers({ shouldAdvanceTime: true });

  /** This should NOT be done. Could not figure out how to get rid of act warning with Vitest,
   * and wanted cleaner test output */
  console.error = vi.fn();
});

test("Memory", async () => {
  const onResetGameClick = vi.fn();

  const bluePair = getCardVariantPair("blue");
  const greenPair = getCardVariantPair("green");
  const TEST_BOARD: Board = { cards: [bluePair[0], greenPair[0], greenPair[1], bluePair[1]] };

  render(<Memory board={TEST_BOARD} onResetGameClick={onResetGameClick} />);

  /** Score should start on 0 */
  expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();

  /** All cards are hidden */
  expect(screen.getAllByRole("button", { name: /hidden/i })).toHaveLength(4);

  /** Pick card on position 0(blue)*/
  await userEvent.click(screen.getByRole("button", { name: /Position: 0/i }));

  /** One blue card should be visible   */
  expect(screen.getAllByRole("button", { name: /blue/i })).toHaveLength(1);

  /** One less hidden card */
  expect(screen.getAllByRole("button", { name: /hidden/i })).toHaveLength(3);

  /** Pick card on position 1(green)*/
  await userEvent.click(screen.getByRole("button", { name: /Position: 1/i }));

  /** One blue and one green card should be visible */
  expect(screen.getAllByRole("button", { name: /blue/i })).toHaveLength(1);
  expect(screen.getAllByRole("button", { name: /green/i })).toHaveLength(1);

  /** One less hidden card */
  expect(screen.getAllByRole("button", { name: /hidden/i })).toHaveLength(2);

  /** Wait for round to finish */
  await act(() => vi.runAllTimers());

  /** Should lose one score */
  expect(screen.getByText(/Score: -1/i)).toBeInTheDocument();

  /** All cards are hidden again */
  expect(screen.getAllByRole("button", { name: /hidden/i })).toHaveLength(4);

  /** Pick card on position 0(blue)*/
  await userEvent.click(screen.getByRole("button", { name: /Position: 0/i }));

  /** Pick card on position 3(blue)*/
  await userEvent.click(screen.getByRole("button", { name: /Position: 3/i }));

  /** Two blue cards should be visible */
  expect(screen.getAllByRole("button", { name: /blue/i })).toHaveLength(2);

  /** Wait for round to finish */
  await act(() => vi.advanceTimersByTime(TIME_BETWEEN_ROUNDS_MS));

  /** One score should be added */
  expect(screen.getByText(/Score: 0/i)).toBeInTheDocument();

  /** The blue card should be removed */
  expect(screen.queryAllByRole("button", { name: /blue/i })).toHaveLength(0);
  expect(screen.getAllByRole("button", { name: /hidden/i })).toHaveLength(2);

  /** Pick card on position 1(green) and position 2(green)*/
  await userEvent.click(screen.getByRole("button", { name: /Position: 1/i }));
  await userEvent.click(screen.getByRole("button", { name: /Position: 2/i }));

  /** Two green cards should be visible */
  expect(screen.getAllByRole("button", { name: /green/i })).toHaveLength(2);

  /** Wait for round to finish */
  await act(() => vi.advanceTimersByTime(TIME_BETWEEN_ROUNDS_MS));

  /** One score should be added */
  expect(screen.getByText(/Score: 1/i)).toBeInTheDocument();

  /** The green cards should be removed */
  expect(screen.queryAllByRole("button", { name: /green/i })).toHaveLength(0);
  expect(screen.queryAllByRole("button", { name: /hidden/i })).toHaveLength(0);

  /** Game should be finished */
  expect(screen.getByText(/Game Finished/i)).toBeInTheDocument();

  /** Click on play again */
  await userEvent.click(screen.getByRole("button", { name: /Play Again/i }));
  expect(onResetGameClick).toHaveBeenCalledTimes(1);
});

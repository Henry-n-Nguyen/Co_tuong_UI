import { Board, Move } from "./class_Board";
import { ErrorGameOver } from "./error_Bot";

/**
 * @param b board that need to find all moves
 * @returns valid moves from current position
 * @throws ErrorGameOver if no valid move found (mate)
 */
export function allMoves(b: Board): Move[] {
    let x: Move[] = [];
    if (x.length > 0) return x;
    else throw new ErrorGameOver(0); // draw 
}

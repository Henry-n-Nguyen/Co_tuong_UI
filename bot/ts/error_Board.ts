import { Board, Move } from "./class_Board";
import { Piece } from "./class_Piece";

export class ErrorNoPieceOnBoard extends Error {
    constructor(board: Board, move: Move) {
        const template = "There is no piece on old position [{x}, {y}].";

        const message = template
            .replace("{x}", move.oldPosition.x + "")
            .replace("{y}", move.oldPosition.y + "")
            + " Board :\n" + board.toString();

        super(message);

    }
}

export class ErrorNoPieceOnRecord extends Error {
    constructor(captured: Piece) {
        const template = "The captured Piece {pieceStr} was at [{x}, {y}] but wasn't exist in onBoardPieces.";
        const message = template
            .replace("{pieceStr}", captured.toString())
            .replace("{x}", captured.position.x + "")
            .replace("{y}", captured.position.y + "");

        super(message);
    }
}
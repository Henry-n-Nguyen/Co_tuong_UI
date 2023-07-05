import { Board } from "./class_Board";

export class ErrorNoPrevMove extends Error {
    constructor(board?: Board, message?: string) {
        if (message) message = message;
        else message = "Board lack prevMove.";

        if (board) message += "The board: \n" + board.toString();

        super(message);
    }
}

export class ErrorTreeNotBuilt extends Error {
    constructor() {
        super("Tree is not built here");
    }
}

/**
 * Indicate that the game is over so your action is invalid
 */
export class ErrorGameOver extends Error {
    /**
     * Indicate winner of this game:
     * 0 -> Draw,
     * 1 -> Red wins,
     * -1 -> Black wins.
     */
    public result: number;

    /**
     * 
     * @param result Result of this game:
     * 0 -> Draw,
     * 1 -> Red wins,
     * -1 -> Black wins.
     */
    constructor(result: number | string) {
        super();
        let message = "The game is ended: ";

        // parse to number
        if (typeof result === "string") {
            result = result.toLowerCase();
            switch (result) {
                case "r" || "red": result = 1; break;
                case "b" || "black": result = -1; break;
                default: result = 0; break;
            }
        }

        // Add winner to message, set value for result
        switch (Math.sign(result)) {
            case 1:
                message += "Red wins.";
                this.result = 1;
                break;
            case -1:
                message += "Black wins.";
                this.result = -1;
                break;
            default:
                message += "Draw.";
                this.result = 0;
                break;
        }

        this.message = message;
    }
}
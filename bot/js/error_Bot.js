export class ErrorNoPrevMove extends Error {
    constructor(board, message) {
        if (message)
            message = message;
        else
            message = "Board lack prevMove.";
        if (board)
            message += "The board: \n" + board.toString();
        super(message);
    }
}
export class ErrorTreeNotBuilt extends Error {
    constructor() {
        super("Tree is not built here");
    }
}
export class ErrorGameOver extends Error {
    constructor(result) {
        super();
        let message = "The game is ended: ";
        if (typeof result === "string") {
            result = result.toLowerCase();
            switch (result) {
                case "r" || "red":
                    result = 1;
                    break;
                case "b" || "black":
                    result = -1;
                    break;
                default:
                    result = 0;
                    break;
            }
        }
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

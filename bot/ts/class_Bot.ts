import { Board, INFINITY } from "./class_Board.js"
import { allMoves } from "./common.js"
import type { Move } from "./class_Board.js";
import { Piece } from "./class_Piece.js";
import { ErrorGameOver, ErrorNoPrevMove, ErrorTreeNotBuilt } from "./error_Bot.js";

type AlphaBeta = {
    alpha: number,
    beta: number
};
type MinMaxOutput = {
    point: number,
    move: Move
}

/**
 * Convert turn and side-to-move base to depth base
 * @param board Board instance that need depth
 * @returns depth of board
 */
function boardDepth(board: Board) {
    return board.turn * 2 + (board.redToPlay ? 0 : 1);
}

export class Bot {
    public board: BoardBot;
    public searchDepth: number;
    public botIsRed: boolean;

    /**
     *
     */
    constructor(searchDepth: number, botIsRed: boolean, startPositions: ((object | null)[][] | null)) {
        this.board = new BoardBot(startPositions, undefined, undefined, undefined);
        this.searchDepth = searchDepth;
        this.botIsRed = botIsRed;

    }

    /**
     * Use this if `bot is red` to make the first move 
     * @returns bot's move
     */
    botFirstMove() {
        let firstMove: Move = {
            oldPosition: { x: 4, y: 3 },
            newPosition: { x: 4, y: 4 }
        };
        this.board._movePiece(firstMove);
        return firstMove;
    }

    async opponentMakeMove(move: Move): Promise<Move> {
        this.board = this.board.movePiece(move).board;

        return (await this._minMaxAlphaBeta()).move;
    }

    //#region min-max 
    async _minMax(): Promise<MinMaxOutput> {
        await this.board.buildBoardTree(this.searchDepth);

        let minMaxOutput: MinMaxOutput;
        if (this.botIsRed) minMaxOutput = this._maxValue(this.board);
        else minMaxOutput = this._minValue(this.board);

        return minMaxOutput
    }
    _maxValue(nextBoard: BoardBot): MinMaxOutput {
        if (boardDepth(nextBoard) - boardDepth(this.board) >= this.searchDepth) {
            if (nextBoard.prevMove) return { point: nextBoard.getPoint(), move: nextBoard.prevMove }
            else throw new ErrorNoPrevMove(nextBoard);
        } else {
            let nextnextBoards = nextBoard.nextBoards;
            let point = -INFINITY;
            let move: Move | undefined;
            if (nextnextBoards.length <= 0) throw new ErrorTreeNotBuilt();
            for (let i = 0; i < nextnextBoards.length; i++) {
                let minValue = this._minValue(nextnextBoards[i]);
                if (point < minValue.point) {
                    point = minValue.point;
                    move = nextnextBoards[i].prevMove;
                    if (!move) throw new ErrorNoPrevMove(nextnextBoards[i]);
                }
            }
            if (move) return { point: point, move: move }
            else throw new Error("Unknow Error");
        }
    }

    _minValue(nextBoard: BoardBot): MinMaxOutput {
        if (boardDepth(nextBoard) - boardDepth(this.board) >= this.searchDepth) {
            if (nextBoard.prevMove) return { point: nextBoard.getPoint(), move: nextBoard.prevMove }
            else throw new ErrorNoPrevMove(nextBoard);
        } else {
            let nextnextBoards = nextBoard.nextBoards;
            let point = INFINITY;
            let move: Move | undefined;
            if (nextnextBoards.length <= 0) throw new ErrorTreeNotBuilt();
            for (let i = 0; i < nextnextBoards.length; i++) {
                // v = min (x, _maxValue)
                let maxValue = this._maxValue(nextnextBoards[i]);
                if (point > maxValue.point) {
                    point = maxValue.point;
                    move = nextnextBoards[i].prevMove;
                    if (!move) throw new ErrorNoPrevMove(nextnextBoards[i]);
                }
            }
            if (move) return { point: point, move: move }
            else throw new Error("Unknown Error");

        }
    }
    //#endregion

    //#region min-max with alpha-beta prune
    async _minMaxAlphaBeta() {
        let alphaBeta = { alpha: -INFINITY, beta: INFINITY };

        let minMaxOutput: Promise<MinMaxOutput>;

        if (this.botIsRed) minMaxOutput = this._maxAlphaBeta(this.board, alphaBeta);
        else minMaxOutput = this._minAlphaBeta(this.board, alphaBeta);

        return minMaxOutput;
    }

    async _minAlphaBeta(board: BoardBot, alphaBeta: AlphaBeta): Promise<MinMaxOutput> {
        if (!board.prevMove) throw new ErrorNoPrevMove(board);

        if (boardDepth(board) - boardDepth(this.board) >= this.searchDepth) {
            return { point: board.getPoint(), move: board.prevMove };
        } else {
            let waiter: Promise<void> | undefined;
            if (board.nextBoards.length <= 0) {
                waiter = board.buildBoardLayer();
                console.log("Tree is not built here, build more");
            }

            let point = INFINITY;
            let move: Move | undefined;

            if (waiter) {
                try {
                    await waiter;
                } catch (errorGameOver) {
                    if (errorGameOver instanceof ErrorGameOver) {
                        move = board.prevMove;
                        switch (errorGameOver.result) {
                            case 1: return { point: INFINITY, move: move };
                            case 0: return { point: 0, move: move };
                            case -1: return { point: -INFINITY, move: move };
                        }
                    } else throw errorGameOver;
                }
            }
            let nextBoards = board.nextBoards;
            for (let i = 0; i < nextBoards.length; i++) {
                // v = min (x, _maxValue)
                let maxValue = await this._maxAlphaBeta(nextBoards[i], alphaBeta);
                if (point > maxValue.point) {
                    point = maxValue.point;
                    move = nextBoards[i].prevMove;
                }

                // break loop to go to outer return 
                if (point < alphaBeta.alpha) break;

                // beta = min (beta, v)
                alphaBeta.beta = alphaBeta.beta < point ? alphaBeta.beta : point;
            }

            if (move) return { point: point, move: move }
            else throw new Error("Unknown Error");
        }
    }

    async _maxAlphaBeta(board: BoardBot, alphaBeta: AlphaBeta): Promise<MinMaxOutput> {
        if (!board.prevMove) throw new ErrorNoPrevMove(board);

        if (boardDepth(board) - boardDepth(this.board) >= this.searchDepth) {
            return { point: board.getPoint(), move: board.prevMove };
        } else {
            let waiter: Promise<void> | undefined;
            if (board.nextBoards.length <= 0) {
                waiter = board.buildBoardLayer();
                console.log("Tree is not built here, build more");
            }

            let point = -INFINITY;
            let move: Move | undefined

            if (waiter) {
                try {
                    await waiter;
                } catch (errorGameOver) {
                    if (errorGameOver instanceof ErrorGameOver) {
                        move = board.prevMove;
                        switch (errorGameOver.result) {
                            case 1: return { point: INFINITY, move: move };
                            case 0: return { point: 0, move: move };
                            case -1: return { point: -INFINITY, move: move };
                        }
                    } else throw errorGameOver;
                }
            }
            let nextBoards = board.nextBoards;
            for (let i = 0; i < nextBoards.length; i++) {
                // v = max (x, _minValue)
                let minValue = await this._minAlphaBeta(nextBoards[i], alphaBeta);
                if (point < minValue.point) {
                    point = minValue.point;
                    move = nextBoards[i].prevMove;
                }

                // break loop to go to outer return 
                if (point > alphaBeta.beta) break;

                // alpha = min (alpha, v)
                alphaBeta.alpha = alphaBeta.beta > point ? alphaBeta.beta : point;
            }

            if (move) return { point: point, move: move }
            else throw new Error("Unknown Error");
        }
    }
    //#endregion
}

class BoardBot extends Board {
    public nextBoards: BoardBot[] = [];
    public prevMove?: Move
    public prevCaptured?: Piece;

    /**
     *
     */
    constructor(
        startPositions: ((object | null)[][] | null),
        prevMove: null | Move | undefined,
        prevCaptured: Piece | null | undefined,
        redToPlay: boolean | string | number | undefined
    ) {
        super(startPositions, redToPlay);
        if (prevMove) this.prevMove = prevMove;
        if (prevCaptured) this.prevCaptured = prevCaptured
    }

    /**
     * Build whole tree upto treeDepth, value stored in nextBoards 
     * @param treeDepth amount of layers to build
     */
    async buildBoardTree(treeDepth: number): Promise<void> {
        if (treeDepth <= 0) return;

        this.buildBoardLayer();

        this.nextBoards.forEach((nBoard) => {
            nBoard.buildBoardTree(treeDepth - 1);
        })

    }

    /**
     * Build the next layer if not existed yet
     * Set value for nextBoards if empty 
     * @throws ErrorGameOver if this board has no valid moves 
     */
    async buildBoardLayer() {
        if (this.nextBoards.length <= 0) {
            allMoves(this).forEach((move) => {
                this.nextBoards.push(this.movePiece(move).board);
            });
        }
    }

    movePiece(move: Move): { captured: Piece | null | undefined, board: BoardBot } {
        for (let i = 0; i < this.nextBoards.length; i++) {
            if (this.nextBoards[i].prevMove === move) {
                return { captured: this.nextBoards[i].prevCaptured, board: this.nextBoards[i] }
            }
        }

        // if not found this moves-> 
        let b = new BoardBot(this.piecesPositionOnBoard, move, this.prevCaptured, this.redToPlay);
        b.turn = this.turn;
        // _movePiece will increase turn or|and change redToPlay  
        return b._movePiece(move);

    }
}
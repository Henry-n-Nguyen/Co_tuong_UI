var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Board, INFINITY } from "./class_Board.js";
import { allMoves } from "./common.js";
import { ErrorGameOver, ErrorNoPrevMove, ErrorTreeNotBuilt } from "./error_Bot.js";
function boardDepth(board) {
    return board.turn * 2 + (board.redToPlay ? 0 : 1);
}
export class Bot {
    constructor(searchDepth, botIsRed, startPositions) {
        this.board = new BoardBot(startPositions, undefined, undefined, undefined);
        this.searchDepth = searchDepth;
        this.botIsRed = botIsRed;
    }
    botFirstMove() {
        let firstMove = {
            oldPosition: { x: 4, y: 3 },
            newPosition: { x: 4, y: 4 }
        };
        this.board._movePiece(firstMove);
        return firstMove;
    }
    opponentMakeMove(move) {
        return __awaiter(this, void 0, void 0, function* () {
            this.board = this.board.movePiece(move).board;
            return (yield this._minMaxAlphaBeta()).move;
        });
    }
    _minMax() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.board.buildBoardTree(this.searchDepth);
            let minMaxOutput;
            if (this.botIsRed)
                minMaxOutput = this._maxValue(this.board);
            else
                minMaxOutput = this._minValue(this.board);
            return minMaxOutput;
        });
    }
    _maxValue(nextBoard) {
        if (boardDepth(nextBoard) - boardDepth(this.board) >= this.searchDepth) {
            if (nextBoard.prevMove)
                return { point: nextBoard.getPoint(), move: nextBoard.prevMove };
            else
                throw new ErrorNoPrevMove(nextBoard);
        }
        else {
            let nextnextBoards = nextBoard.nextBoards;
            let point = -INFINITY;
            let move;
            if (nextnextBoards.length <= 0)
                throw new ErrorTreeNotBuilt();
            for (let i = 0; i < nextnextBoards.length; i++) {
                let minValue = this._minValue(nextnextBoards[i]);
                if (point < minValue.point) {
                    point = minValue.point;
                    move = nextnextBoards[i].prevMove;
                    if (!move)
                        throw new ErrorNoPrevMove(nextnextBoards[i]);
                }
            }
            if (move)
                return { point: point, move: move };
            else
                throw new Error("Unknow Error");
        }
    }
    _minValue(nextBoard) {
        if (boardDepth(nextBoard) - boardDepth(this.board) >= this.searchDepth) {
            if (nextBoard.prevMove)
                return { point: nextBoard.getPoint(), move: nextBoard.prevMove };
            else
                throw new ErrorNoPrevMove(nextBoard);
        }
        else {
            let nextnextBoards = nextBoard.nextBoards;
            let point = INFINITY;
            let move;
            if (nextnextBoards.length <= 0)
                throw new ErrorTreeNotBuilt();
            for (let i = 0; i < nextnextBoards.length; i++) {
                let maxValue = this._maxValue(nextnextBoards[i]);
                if (point > maxValue.point) {
                    point = maxValue.point;
                    move = nextnextBoards[i].prevMove;
                    if (!move)
                        throw new ErrorNoPrevMove(nextnextBoards[i]);
                }
            }
            if (move)
                return { point: point, move: move };
            else
                throw new Error("Unknown Error");
        }
    }
    _minMaxAlphaBeta() {
        return __awaiter(this, void 0, void 0, function* () {
            let alphaBeta = { alpha: -INFINITY, beta: INFINITY };
            let minMaxOutput;
            if (this.botIsRed)
                minMaxOutput = this._maxAlphaBeta(this.board, alphaBeta);
            else
                minMaxOutput = this._minAlphaBeta(this.board, alphaBeta);
            return minMaxOutput;
        });
    }
    _minAlphaBeta(board, alphaBeta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!board.prevMove)
                throw new ErrorNoPrevMove(board);
            if (boardDepth(board) - boardDepth(this.board) >= this.searchDepth) {
                return { point: board.getPoint(), move: board.prevMove };
            }
            else {
                let waiter;
                if (board.nextBoards.length <= 0) {
                    waiter = board.buildBoardLayer();
                    console.log("Tree is not built here, build more");
                }
                let point = INFINITY;
                let move;
                if (waiter) {
                    try {
                        yield waiter;
                    }
                    catch (errorGameOver) {
                        if (errorGameOver instanceof ErrorGameOver) {
                            move = board.prevMove;
                            switch (errorGameOver.result) {
                                case 1: return { point: INFINITY, move: move };
                                case 0: return { point: 0, move: move };
                                case -1: return { point: -INFINITY, move: move };
                            }
                        }
                        else
                            throw errorGameOver;
                    }
                }
                let nextBoards = board.nextBoards;
                for (let i = 0; i < nextBoards.length; i++) {
                    let maxValue = yield this._maxAlphaBeta(nextBoards[i], alphaBeta);
                    if (point > maxValue.point) {
                        point = maxValue.point;
                        move = nextBoards[i].prevMove;
                    }
                    if (point < alphaBeta.alpha)
                        break;
                    alphaBeta.beta = alphaBeta.beta < point ? alphaBeta.beta : point;
                }
                if (move)
                    return { point: point, move: move };
                else
                    throw new Error("Unknown Error");
            }
        });
    }
    _maxAlphaBeta(board, alphaBeta) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!board.prevMove)
                throw new ErrorNoPrevMove(board);
            if (boardDepth(board) - boardDepth(this.board) >= this.searchDepth) {
                return { point: board.getPoint(), move: board.prevMove };
            }
            else {
                let waiter;
                if (board.nextBoards.length <= 0) {
                    waiter = board.buildBoardLayer();
                    console.log("Tree is not built here, build more");
                }
                let point = -INFINITY;
                let move;
                if (waiter) {
                    try {
                        yield waiter;
                    }
                    catch (errorGameOver) {
                        if (errorGameOver instanceof ErrorGameOver) {
                            move = board.prevMove;
                            switch (errorGameOver.result) {
                                case 1: return { point: INFINITY, move: move };
                                case 0: return { point: 0, move: move };
                                case -1: return { point: -INFINITY, move: move };
                            }
                        }
                        else
                            throw errorGameOver;
                    }
                }
                let nextBoards = board.nextBoards;
                for (let i = 0; i < nextBoards.length; i++) {
                    let minValue = yield this._minAlphaBeta(nextBoards[i], alphaBeta);
                    if (point < minValue.point) {
                        point = minValue.point;
                        move = nextBoards[i].prevMove;
                    }
                    if (point > alphaBeta.beta)
                        break;
                    alphaBeta.alpha = alphaBeta.beta > point ? alphaBeta.beta : point;
                }
                if (move)
                    return { point: point, move: move };
                else
                    throw new Error("Unknown Error");
            }
        });
    }
}
class BoardBot extends Board {
    constructor(startPositions, prevMove, prevCaptured, redToPlay) {
        super(startPositions, redToPlay);
        this.nextBoards = [];
        if (prevMove)
            this.prevMove = prevMove;
        if (prevCaptured)
            this.prevCaptured = prevCaptured;
    }
    buildBoardTree(treeDepth) {
        return __awaiter(this, void 0, void 0, function* () {
            if (treeDepth <= 0)
                return;
            this.buildBoardLayer();
            this.nextBoards.forEach((nBoard) => {
                nBoard.buildBoardTree(treeDepth - 1);
            });
        });
    }
    buildBoardLayer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.nextBoards.length <= 0) {
                allMoves(this).forEach((move) => {
                    this.nextBoards.push(this.movePiece(move).board);
                });
            }
        });
    }
    movePiece(move) {
        for (let i = 0; i < this.nextBoards.length; i++) {
            if (this.nextBoards[i].prevMove === move) {
                return { captured: this.nextBoards[i].prevCaptured, board: this.nextBoards[i] };
            }
        }
        let b = new BoardBot(this.piecesPositionOnBoard, move, this.prevCaptured, this.redToPlay);
        b.turn = this.turn;
        return b._movePiece(move);
    }
}

import { Xe, Ma, Vua, Si, Tuong, Phao, Tot, Piece } from "./class_Piece.js"
import type { PiecePosition } from "./class_Piece.js";
import { ErrorNoPieceOnBoard, ErrorNoPieceOnRecord } from "./error_Board.js";

export type Move = {
    oldPosition: PiecePosition,
    newPosition: PiecePosition
}

export const INFINITY = 100_000;

function parseSideToPlay(isRedPlay: (boolean | string | number | undefined)): boolean {
    let isRedPlayBool: boolean = true;

    switch (typeof isRedPlay) {
        case "string":
            isRedPlay = isRedPlay.toLowerCase();
            if (isRedPlay === "red" || isRedPlay === "r") isRedPlayBool = true;
            if (isRedPlay === "black" || isRedPlay === "b") isRedPlayBool = false;
            break
        case "number":
            isRedPlay = Math.sign(isRedPlay);
            // if (isRedPlay == 0) throw new Error("Invalid isRedPlay value = 0");
            isRedPlayBool = isRedPlay > 0 ? true : false;
            break
        case "boolean":
            isRedPlayBool = isRedPlay;
            break
        default:
            isRedPlayBool = true
    }


    return isRedPlayBool;
}

const defaultPosition = [
    ["C1", null, null, "Z4", null, null, "z4", null, null, "c1",],
    ["M1", null, "P1", null, null, null, null, "p1", null, "m1",],
    ["X1", null, null, "Z3", null, null, "z3", null, null, "x1",],
    ["S1", null, null, null, null, null, null, null, null, "s1",],
    ["J0", null, null, "Z2", null, null, "z2", null, null, "j0",],
    ["S0", null, null, null, null, null, null, null, null, "s0",],
    ["X0", null, null, "Z1", null, null, "z1", null, null, "x0",],
    ["M0", null, "P0", null, null, null, null, "p0", null, "m0",],
    ["C0", null, null, "Z0", null, null, "z0", null, null, "c0",]
];
export class Board {
    public redToPlay: boolean;
    public onBoardPieces: Piece[];
    public turn: number;
    public piecesPositionOnBoard: (Piece | null)[][];

    constructor(startPositions: ((object | null)[][] | null), redToPlay: boolean | string | number | undefined) {
        this.redToPlay = parseSideToPlay(redToPlay);
        this.onBoardPieces = [];
        this.turn = 0;

        var refinedStartPositions: (object | string | null)[][];
        if (startPositions) refinedStartPositions = startPositions;
        else refinedStartPositions = defaultPosition;
        // 2D of pieces
        this.piecesPositionOnBoard = [];
        for (var i = 0; i < refinedStartPositions.length; i++) {
            // create current column and put to 2D array
            let colPieces: (Piece | null)[] = [];
            this.piecesPositionOnBoard.push(colPieces);
            for (var j = 0; j < refinedStartPositions[i].length; j++) {
                // check if null
                // if (!refinedStartPositions[i][j]) {
                //     colPieces.push(null)
                //     continue;
                // };
                // get identifier
                const pieceChar = refinedStartPositions[i][j]?.toString().charAt(0) // rSP is never null
                let thisPiece: Piece | null;
                switch (pieceChar) {
                    case undefined:
                        thisPiece = null;
                        break;
                    case "C":
                        thisPiece = new Xe(true, { x: i, y: j });
                        break;
                    case "M":
                        thisPiece = new Ma(true, { x: i, y: j });
                        break;
                    case "X":
                        thisPiece = new Vua(true, { x: i, y: j });
                        break;
                    case "S":
                        thisPiece = new Si(true, { x: i, y: j });
                        break;
                    case "J":
                        thisPiece = new Tuong(true, { x: i, y: j });
                        break;
                    case "P":
                        thisPiece = new Phao(true, { x: i, y: j });
                        break;
                    case "Z":
                        thisPiece = new Tot(true, { x: i, y: j });
                        break;
                    case "c":
                        thisPiece = new Xe(false, { x: i, y: j });
                        break;
                    case "m":
                        thisPiece = new Ma(false, { x: i, y: j });
                        break;
                    case "x":
                        thisPiece = new Vua(false, { x: i, y: j });
                        break;
                    case "s":
                        thisPiece = new Si(false, { x: i, y: j });
                        break;
                    case "j":
                        thisPiece = new Tuong(false, { x: i, y: j });
                        break;
                    case "p":
                        thisPiece = new Phao(false, { x: i, y: j });
                        break;
                    case "z":
                        thisPiece = new Tot(false, { x: i, y: j });
                        break;
                    default:
                        throw new Error("This piece `" + pieceChar + "` at `" + i + j + "` is not available");
                }
                colPieces.push(thisPiece);
                if (thisPiece) this.onBoardPieces.push(thisPiece);
            }
        }
        console.log("Your boards:");
        console.log(this.toString());

        console.log("Pieces on boards:");
        console.log(this.onBoardPieces);
    }

    getPoint() {
        let point = 0;
        this.onBoardPieces.forEach(piece => {
            point += piece.getCurrentValue();
        });
        return point;
    }

    /**
     * This method create a new board that piece from position is moved to newPosition, remove and return captured piece. 
     * Current board MAY NOT CHANGED.
     * This method DOES NOT validate the move with any play rules.
     * return captured piece and board after this move
     */
    movePiece(move: Move): { captured: Piece | null | undefined, board: Board } {
        return this._movePiece(move);
    }

    /**
     * Actually move a piece on board, use locally
     * @param move a validated move
     * @returns captured piece and this
     */
    _movePiece(move: Move) {
        let { x, y } = move.oldPosition;
        let thisPiece = this.piecesPositionOnBoard[x][y];
        if (!thisPiece) throw new ErrorNoPieceOnBoard(this, move);

        let { x: newX, y: newY } = move.newPosition;
        this.piecesPositionOnBoard[x][y] = null;
        let captured = this.piecesPositionOnBoard[newX][newY];
        this.piecesPositionOnBoard[newX][newY] = thisPiece;
        thisPiece.position.x = newX; thisPiece.position.y = newY;

        if (this.redToPlay === true) { this.redToPlay = false; } else { this.redToPlay = true; this.turn += 1; }

        if (captured) {
            const capturedIndex = this.onBoardPieces.findIndex(x => { x == captured });
            if (capturedIndex < 0) throw new ErrorNoPieceOnRecord(captured);
            this.onBoardPieces.splice(capturedIndex, 1); // NOTE: 1 causes onBoardPieces lose a piece in old implementation
        }
        return { captured: captured, board: this };

    }

    /**
     * @returns string represent piece on board as English characters for vision purpose
     */
    toString() {
        let outp: string = "";

        for (let x = 0; x < this.piecesPositionOnBoard.length; x++) {
            for (let y = this.piecesPositionOnBoard[x].length; y >= 0; y--) {
                let pieceStr = this.piecesPositionOnBoard[x][y]?.toString().charAt(0) || " ";
                outp.concat(pieceStr);
            }
            outp.concat("\n");
        }
        return outp;
    }

    /**
     * @returns string represent piece on board as Chinese characters for vision purpose
     */
    toChineseString() {
        let outp: string = "";

        for (let x = 0; x < this.piecesPositionOnBoard.length; x++) {
            for (let y = this.piecesPositionOnBoard[x].length; y >= 0; y--) {
                let pieceStr = this.piecesPositionOnBoard[x][y]?.text?.charAt(0) || " ";
                outp.concat(pieceStr);
            }
            outp.concat("\n");
        }
        return outp;
    }
}

// ---------------------------GUI---------------------------
export type BoardStyle = {
    width: number,
    height: number,
    spaceX: number,
    spaceY: number,
    pointStartX: number,
    pointStartY: number,
    page: string
}
const defaultStyle: BoardStyle = {
    width: 325,
    height: 402,
    spaceX: 35,
    spaceY: 36,
    pointStartX: 5,
    pointStartY: 19,
    page: "stype_1"
};

class Background {
    public context2d: any;
    public sizeSetting: BoardStyle;
    public x: number;
    public y: number;
    public img: HTMLImageElement;

    constructor(context2d: any, sizeSetting: BoardStyle) {
        this.context2d = context2d;
        this.sizeSetting = sizeSetting;
        this.x = 0;
        this.y = 0;
        this.img = new Image();
        this.img.src = "/img/stype_1/bg.png";
    }

    show() {
        this.context2d.drawImage(this.img, this.sizeSetting.spaceX * this.x, this.sizeSetting.spaceY * this.y);
    }
}

class Pane {
    public context2d: any;
    public sizeSetting: BoardStyle;
    public x: number;
    public y: number;
    public newX: number;
    public newY: number;
    public img: HTMLImageElement;
    public isShow: boolean;

    constructor(context2d: any, sizeSetting: BoardStyle) {
        this.context2d = context2d;
        this.sizeSetting = sizeSetting;
        this.x = 0;
        this.y = 0;
        this.newX = 0;
        this.newY = 0;
        this.img = new Image();
        this.img.src = "/img/stype_1/r_box.png";
        this.isShow = false;
    }

    show() {
        if (this.isShow) {
            this.context2d.drawImage(this.img, this.sizeSetting.spaceX * this.x + this.sizeSetting.pointStartX, this.sizeSetting.spaceY * this.y + this.sizeSetting.pointStartY)
            this.context2d.drawImage(this.img, this.sizeSetting.spaceX * this.newX + this.sizeSetting.pointStartX, this.sizeSetting.spaceY * this.newY + this.sizeSetting.pointStartY)
        }
    }
}

class Dot {
    public context2d: any;
    public sizeSetting: BoardStyle;
    public x: number;
    public y: number;
    public img: HTMLImageElement;
    public dots: any; // Todo: check what is dot

    constructor(context2d: any, sizeSetting: BoardStyle) {
        this.context2d = context2d;
        this.sizeSetting = sizeSetting;
        this.x = 0;
        this.y = 0;
        this.img = new Image();
        this.img.src = "/img/stype_1/dot.png"
        this.dots = [];
    }

    show() {
        for (let i = 0; i < this.dots.length; i++) {
            this.context2d.drawImage(this.img, this.sizeSetting.spaceX * this.x + this.sizeSetting.pointStartX, this.sizeSetting.spaceY * this.y + this.sizeSetting.pointStartY);
        }
    }
}

export class BoardGUI extends Board {
    public context2d: any;
    public sizeSetting: BoardStyle;
    public bg: Background;
    public pane: Pane;
    public dot: Dot;
    public context2dAvailabler: any;

    constructor(startPositions: object[][] | null, context2dAvailabler: any, sizeSetting: BoardStyle) {
        super(startPositions, undefined);

        this.context2dAvailabler = context2dAvailabler;
        let thisContext2d = context2dAvailabler.getContext("2d");
        this.context2d = thisContext2d;
        this.sizeSetting = sizeSetting || defaultStyle;
        this.bg = new Background(thisContext2d, sizeSetting);
        this.pane = new Pane(thisContext2d, sizeSetting);
        this.dot = new Dot(thisContext2d, sizeSetting);

        context2dAvailabler.addEventListener("click", (e: MouseEvent) => {
            let { piece, point: { x, y } } = this.getClicked(e);
            if (piece) {
                // Todo: Player clicked piece
            } else {
                // Todo: Player clicked point 
            }
        });
    }

    show() {
        this.context2d.clearRect(0, 0, 325, 402);
        if (this.bg) this.bg.show();
        if (this.pane) this.pane.show();
        if (this.dot) this.dot.show();
        for (let i = 0; i < this.onBoardPieces.length; i++) {
            this.onBoardPieces[i].show(this.context2d);
        }

    }

    getClicked(e: MouseEvent) {
        if (!this.sizeSetting) throw new Error("This object is not init properly, lack sizeSetting");
        let domXY = getDomXY(this.context2dAvailabler);
        let x = Math.round((e.pageX - domXY.x - this.sizeSetting.pointStartX - 20) / this.sizeSetting.spaceX)
        let y = Math.round((e.pageY - domXY.y - this.sizeSetting.pointStartY - 20) / this.sizeSetting.spaceY)

        return {
            piece: this.piecesPositionOnBoard[x][y],
            point: { x: x, y: y }
        }
    }
}

// not used here: play.js
// take the canvas and return its position 
// + piece's position (on web) => piece's coordinate 
function getDomXY(dom: any) {
    var left = dom.offsetLeft;
    var top = dom.offsetTop;
    var current = dom.offsetParent;
    while (current !== null) {
        left += current.offsetLeft;
        top += current.offsetTop;
        current = current.offsetParent;
    }
    return { x: left, y: top };
}
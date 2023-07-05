import { Board } from "./class_Board.js";

// ------------------ Piece ----------------------------
const PROPERTIES = {
    red: {
        Xe: { text: "俥", imgStr: 'r_c' },
        Ma: { text: "傌", imgStr: 'r_m' },
        Vua: { text: "帥", imgStr: 'r_x' },
        Si: { text: "仕", imgStr: 'r_s' },
        Tuong: { text: "相", imgStr: 'r_j' },
        Phao: { text: "炮", imgStr: 'r_p' },
        Tot: { text: "兵", imgStr: 'r_z' }
    },
    black: {
        Xe: { text: "車", imgStr: 'r_c' },
        Ma: { text: "馬", imgStr: 'r_m' },
        Vua: { text: "將", imgStr: 'r_x' },
        Si: { text: "士", imgStr: 'r_s' },
        Tuong: { text: "象", imgStr: 'r_j' },
        Phao: { text: "砲", imgStr: 'r_p' },
        Tot: { text: "卒", imgStr: 'r_z' }
    },
    yLength: 10,
    xLength: 9
}
const VALUE = {
    Xe: 0,
    Ma: 0,
    Vua: 9999,
    Si: 0,
    Tuong: 0,
    Phao: 0,
    Tot: 0
}
let POSITION_VALUES: { [key: string]: [number[], number[], number[], number[], number[], number[], number[], number[], number[]] } = {}
POSITION_VALUES.Xe = [
    [206, 206, 206, 206, 208, 208, 204, 198, 200, 194],
    [208, 212, 208, 213, 211, 212, 209, 208, 208, 206],
    [207, 209, 207, 213, 211, 212, 204, 204, 206, 204],
    [213, 216, 214, 216, 214, 214, 212, 212, 212, 212],
    [214, 233, 216, 216, 215, 215, 214, 212, 200, 200],
    [213, 216, 214, 216, 214, 214, 212, 212, 212, 212],
    [207, 209, 207, 213, 211, 212, 204, 204, 206, 204],
    [208, 212, 208, 213, 211, 212, 209, 208, 208, 206],
    [206, 206, 206, 206, 208, 208, 204, 198, 200, 194],
];

POSITION_VALUES.Ma = [
    [90, 90, 92, 93, 90, 90, 92, 93, 85, 88],
    [90, 96, 98, 108, 100, 98, 94, 92, 90, 85],
    [90, 103, 99, 100, 99, 101, 98, 94, 92, 90],
    [96, 97, 103, 107, 103, 102, 95, 95, 93, 88],
    [90, 94, 99, 100, 104, 103, 98, 92, 78, 90],
    [96, 97, 103, 107, 103, 102, 95, 95, 93, 88],
    [90, 103, 99, 100, 99, 101, 98, 94, 92, 90],
    [90, 96, 98, 108, 100, 98, 94, 92, 90, 85],
    [90, 90, 92, 93, 90, 90, 92, 93, 85, 88],
];

POSITION_VALUES.Tuong = [
    [0, 0, 18, 0, 0, 0, 0, 18, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [20, 0, 0, 0, 20, 20, 0, 0, 0, 20],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 23, 0, 0, 0, 0, 23, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [20, 0, 0, 0, 20, 20, 0, 0, 0, 20],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 18, 0, 0, 0, 0, 18, 0, 0]
];

POSITION_VALUES.Si = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [20, 0, 20, 0, 0, 0, 0, 20, 0, 20],
    [0, 23, 0, 0, 0, 0, 0, 0, 23, 0],
    [20, 0, 20, 0, 0, 0, 0, 20, 0, 20],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
];

POSITION_VALUES.Phao = [
    [100, 98, 97, 96, 96, 95, 96, 97, 96, 96],
    [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
    [96, 96, 96, 99, 96, 99, 96, 100, 98, 97],
    [91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
    [90, 89, 92, 100, 100, 100, 96, 101, 98, 99],
    [91, 92, 91, 98, 96, 96, 96, 99, 98, 99],
    [96, 96, 96, 99, 96, 99, 96, 100, 98, 97],
    [100, 98, 97, 99, 96, 96, 96, 96, 97, 96],
    [100, 98, 97, 96, 96, 95, 96, 97, 96, 96],
];

POSITION_VALUES.Tot = [
    [9, 19, 19, 19, 14, 7, 7, 0, 0, 0],
    [9, 24, 24, 23, 18, 0, 0, 0, 0, 0],
    [9, 34, 32, 27, 20, 13, 7, 0, 0, 0],
    [11, 42, 37, 29, 27, 0, 0, 0, 0, 0],
    [13, 44, 37, 30, 29, 16, 15, 0, 0, 0],
    [11, 42, 37, 29, 27, 0, 0, 0, 0, 0],
    [9, 34, 32, 27, 20, 13, 7, 0, 0, 0],
    [9, 24, 24, 23, 18, 0, 0, 0, 0, 0],
    [9, 19, 19, 19, 14, 7, 7, 0, 0, 0],
];

function parseSide(isRedPiece: (boolean | string | number)) {
    let scale = 0;
    if (typeof isRedPiece === "boolean") {
        if (isRedPiece) scale = 1; else scale = -1;
    }
    else if (typeof isRedPiece === "string") {
        isRedPiece = isRedPiece.toLowerCase();
        if (isRedPiece === "red" || isRedPiece === "r") scale = 1;
        if (isRedPiece === "black" || isRedPiece === "b") scale = -1;
    }
    else if (typeof isRedPiece === "number") {
        isRedPiece = Math.sign(isRedPiece);
    }
    if (scale == 0) throw new Error("Invalid isRedPiece value");

    return scale;
}

export type PiecePosition = {
    x: number,
    y: number
}

export class Piece {
    public scale: number;
    public position: PiecePosition;
    public baseValue: number;
    public selected: boolean;
    public imgStr?: string;
    public text?: string;

    constructor(scale: number, position: PiecePosition, baseValue: number) {
        this.scale = scale;
        this.position = position;
        this.baseValue = baseValue;
        this.selected = false;
    }

    getCurrentValue() {
        return this.scale * (this.baseValue + this._getPositionValue());
    }

    show(canvas2dcontext: any) {
        canvas2dcontext.save();
        canvas2dcontext.globalAlpha = 1;
        canvas2dcontext.drawImage(this.getImg(), 35 * this.position.x + 5, 36 * this.position.y + 19);
        canvas2dcontext.restore();
    }

    getImg() {
        let out = new Image();
        out.src = "/img/stype_1/" + this.imgStr + ".png";
        return out;
    }

    click(board: Board) {
        this.selected = !this.selected;
        // Todo: remove all dots 
        if (this.selected) {
            let moves = this.getPosibleMoves(board);
            // Todo: show dots
        }
    }

    // ---------------------------abtract methods---------------------------
    getPosibleMoves(_board: Board) {
        return [];
    }

    _getPositionValue() {
        return 0;
    }

    toString() {
        return "";
    }

}

export class Xe extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Xe);

        if (scale > 0) {
            var properties = PROPERTIES.red.Xe;
        } else {
            var properties = PROPERTIES.black.Xe;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Xe[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "C" : "c";
    }
}

export class Ma extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Ma);

        if (scale > 0) {
            var properties = PROPERTIES.red.Ma;
        } else {
            var properties = PROPERTIES.black.Ma;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Ma[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "M" : "m";
    }
}

export class Vua extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Vua);

        if (scale > 0) {
            var properties = PROPERTIES.red.Vua;
        } else {
            var properties = PROPERTIES.black.Vua;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    toString(): string {
        return this.scale > 0 ? "J" : "j";
    }
}

export class Si extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Si);

        if (scale > 0) {
            var properties = PROPERTIES.red.Si;
        } else {
            var properties = PROPERTIES.black.Si;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Si[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "S" : "s";
    }
}

export class Tuong extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Tuong);

        if (scale > 0) {
            var properties = PROPERTIES.red.Tuong;
        } else {
            var properties = PROPERTIES.black.Tuong;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Tuong[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "X" : "x";
    }
}

export class Phao extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Phao);

        if (scale > 0) {
            var properties = PROPERTIES.red.Phao;
        } else {
            var properties = PROPERTIES.black.Phao;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Phao[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "P" : "p";
    }
}

export class Tot extends Piece {

    constructor(isRedPiece: (boolean | string | number), position: PiecePosition) {
        let scale = parseSide(isRedPiece);
        super(scale, position, VALUE.Tot);

        if (scale > 0) {
            var properties = PROPERTIES.red.Tot;
        } else {
            var properties = PROPERTIES.black.Tot;
        }
        this.text = properties.text;
        this.imgStr = properties.imgStr;
    }

    _getPositionValue() {
        let { x, y } = this.position;
        if (this.scale < 0) {
            y = PROPERTIES.yLength - 1 - y; // length - 1 - y
            x = PROPERTIES.xLength - 1 - x;
        }
        return POSITION_VALUES.Tot[x][y];
    }

    toString(): string {
        return this.scale > 0 ? "Z" : "z";
    }
}
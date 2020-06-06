const ChessPiece = require('./chesspiece')
const Square = require('./square')
// when indexing, remember: [y][x]. 


const to2D = {
    105:0, 195:1, 285: 2, 375: 3, 465: 4, 555: 5, 645: 6, 735: 7
}

class Game {
    constructor(isWhitesTurn) {
        this.chessBoard = this.makeStartingBoard() // the actual chessBoard
        this.isWhitesTurn = isWhitesTurn // boolean
    }

    getBoard() {
        return this.chessBoard
    }

    nextPlayersTurn() {
        this.isWhitesTurn = !this.isWhitesTurn
    }

    setBoard(newBoard) {
        this.chessBoard = newBoard
    }

    movePiece(pieceId, to) {
        /* 
            String, [canvasX, canvasY] => void 

            should move a selected piece to a specific coord. 
            If that piece cannot go to said coord, movePiece 
            should return false. 
        */
        var currentBoard = this.getBoard()
        const pieceCoordinates = this.findPiece(currentBoard, pieceId)
        
        
        // can't find piece coordinates (piece doesn't exist on the board)
        if (!pieceCoordinates) {
            return
        }

        const y = pieceCoordinates[1]
        const x = pieceCoordinates[0]

        // new coordinates
        const to_y = to2D[to[1]]
        const to_x = to2D[to[0]]

        const originalPiece = currentBoard[y][x].getPiece()
    
        if (y === to_y && x === to_x) {
            return "moved in the same position."
        }

        // Give the new square the piece that was just moved onto it. 
        const reassign = currentBoard[to_y][to_x].setPiece(originalPiece)

        if (reassign != "user tried to capture their own piece") {
            // get rid of the piece on the original square.
            currentBoard[y][x].setPiece(null)
        } else {
            return reassign
        }


        // update all the pieces on the new board with their new possible moves.
        const newBoard = this.updateAllPieces(currentBoard)

        // update board
        this.setBoard(newBoard)

        /**
         * Below just prints a 2D representation
         * of the current state of the chess
         * board
         */ 
        // for (var i = 0; i < 8; i++) {
        //     var row = []
        //     for (var j = 0; j < 8; j++) {
        //         row.push(currentBoard[i][j].getPieceIdOnThisSquare())
        //     }       
        //     console.log(row)
        // }
    }


    updateAllPieces(board) {
        /**
         * Should update all the pieces on the 
         * given board with their new legal moves. 
         */
        return board
    }

    findPiece(board, pieceId) {
        // ChessBoard, String -> [Int, Int]
        console.log("piecetofind: " + pieceId)
        for (var i = 0; i < 8; i++) {
            for (var j = 0; j < 8; j++) {
                if (board[i][j].getPieceIdOnThisSquare() === pieceId) {
                    return [j, i]
                }
            }
        }
    }

    makeStartingBoard() {
        const backRank = ["rook", "knight", "bishop", "queen", "king", "bishop", "knight", "rook"]
        var startingChessBoard = []
        for (var i = 0; i < 8; i++) {
            startingChessBoard.push([])
            for (var j = 0; j < 8; j++) {
                // j is horizontal
                // i is vertical
                const coordinatesOnCanvas = [((j + 1) * 90 + 15), ((i + 1) * 90 + 15)]
                const emptySquare = new Square(j, i, null, coordinatesOnCanvas)
                
                startingChessBoard[i].push(emptySquare)
            }
        }
        const whiteBackRankId = ["wr1", "wn1", "wb1", "wq1", "wk1", "wb2", "wn2", "wr2"]
        const blackBackRankId = ["br1", "bn1", "bb1", "bq1", "bk1", "bb2", "bn2", "br2"]
        for (var j = 0; j < 8; j += 7) {
            for (var i = 0; i < 8; i++) {
                if (j == 0) {
                    // top
                    startingChessBoard[j][i].setPiece(new ChessPiece(backRank[i], false, "black", blackBackRankId[i]))
                    startingChessBoard[j + 1][i].setPiece(new ChessPiece("pawn", false, "black", "bp" + i))
                } else {
                    // bottom
                    startingChessBoard[j][i].setPiece(new ChessPiece(backRank[i], false, "white", whiteBackRankId[i]))
                    startingChessBoard[j - 1][i].setPiece(new ChessPiece("pawn", false, "white", "wp" + i))
                }
            }
        }
        for (var y = 0; y < 8; y++) {
            for (var x = 0; x < 8; x++) {
                if (startingChessBoard[y][x].isOccupied()) {
                    startingChessBoard[y][x].getPiece().generatePossibleSquares(startingChessBoard) // sets the state of each piece
                }
            }
        }
        return startingChessBoard
    }
}

module.exports = Game
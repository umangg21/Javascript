const QuesBoard = [["53..7...."], ["6..195..."], [".98....6."], ["8...6...3"], ["4..8.3..1"], ["7...2...6"], [".6....28."], ["...419..5"], ["....8..79"]]

getBoard = () => {
    const board = []
    QuesBoard.forEach(row => {
        const tempRow = []
        for (let index = 0; index < row[0].length; index++) {
            const element = row[0][index];
            if (element == ".") tempRow.push(0)
            else tempRow.push(parseInt(element))
        }
        board.push(tempRow)
    })
    return board
}

getfinalBoard = (board = [[]]) => {
    const finalBoard = []
    board.forEach(row => {
        finalBoard.push(row.join(""))
    })
    return finalBoard
}

isRowUsed = (board = [[]], row, num) => {
    for (let i = 0; i < 9; i++) {
        if (board[row][i] === num)
            return true
    }
    return false
}

isColUsed = (board = [[]], col, num) => {
    for (let i = 0; i < 9; i++) {
        if (board[i][col] === num)
            return true
    }
    return false
}

isBoxUsed = (board = [[]], box_row, box_col, num) => {
    for (let i = box_row; i < box_row + 3; i++) {
        for (let j = box_col; j < box_col + 3; j++) {
            if (board[i][j] === num)
                return true
        }
    }
    return false
}

isSafe = (board = [[]], row, col, num) => {
    return !isRowUsed(board, row, num) && !isColUsed(board, col, num) && !isBoxUsed(board, row - row % 3, col - col % 3, num)
}

findEmptyLocation = (board = [[]], loc = []) => {
    for (let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            if (board[i][j] === 0) {
                loc[0] = i, loc[1] = j
                return true
            }
        }
    }
    return false
}

solveSudoku = (board) => {
    let loc = [0, 0]

    if (!findEmptyLocation(board, loc)) {
        return true
    }

    let row = loc[0]
    let col = loc[1]
    for (let num = 1; num < 10; num++) {
        if (isSafe(board, row, col, num)) {
            board[row][col] = num

            if (solveSudoku(board)) {
                return true
            }
            board[row][col] = 0
        }
    }
    return false
}


board = getBoard()
var b;
if (solveSudoku(board)) {
    b = getfinalBoard(board)
}

console.table(b)
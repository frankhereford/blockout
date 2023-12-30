# Scoring Criteria:

- Processing a move. outcomes:

  - Next Piece could not be created, game over. (-100)
  - A move could not occur and the piece can be moved again. (-50)
  - A move occurred and the piece can be moved again. (-10)
  - Piece was placed into the pile and a new piece was created. (-5)

    - The piece's resting point has a highest Y value, better the lower the number that is. (-Y + boardHeight)
    - The board has a highest Y value, the better the lower the number is. (-Y + boardHeight)

    - N floors were cleared (N \* 50)

#!/usr/bin/env python3

import torch
import random
import numpy as numpy
from collections import deque
from TetrisGame import Tetris

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001


class Agent:
    def __init__(self):
        pass

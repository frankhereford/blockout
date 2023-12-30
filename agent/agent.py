#!/usr/bin/env python3

import torch
import random
import numpy as numpy
from collections import deque
from TetrisGame import Tetris
import time

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001


class Agent:
    def __init__(self):
        self.number_games = 0
        self.epsilon = 0
        self.gamma = 0
        self.memory = deque(maxlen=MAX_MEMORY)

    def get_state(self, game):
        pass

    def remember(self, state, action, reward, next_state, done):
        pass

    def train_long_memory(self):
        pass

    def train_short_memory(self, state, action, reward, next_state, done):
        pass

    def get_action(self, state):
        move = {
            "drop": True,
            "movement": {"x": 0, "y": 0, "z": 0, "pitch": 0, "yaw": 0, "roll": 0},
        }
        return move


def train():
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    agent = Agent()
    game = Tetris()
    while True:
        # time.sleep(1)
        state_old = game.get_game_state()
        # print("Old state:", state_old)

        final_move = agent.get_action(state_old)

        move_result = game.move_piece(final_move)
        # print("Move result:", move_result)
        reward = move_result["move_reward"]
        done = not move_result["game_result"]
        score = move_result["gameScore"]
        # print("Reward:", reward)
        # print("Done:", done)
        # print("Score:", score)
        state_new = game.get_game_state()

        # train short memory
        agent.train_short_memory(state_old, final_move, reward, state_new, done)

        agent.remember(state_old, final_move, reward, state_new, done)

        if done:
            # train long memory, plot result
            game.reset()
            agent.number_games += 1
            agent.train_long_memory()
            if score > record:
                record = score
                # agent.model.save()

            print("Game", agent.number_games, "Score", score, "Record:", record)


if __name__ == "__main__":
    train()

#!/usr/bin/env python3

import torch
import random
import time
import numpy as np
from collections import deque
from TetrisGame import Tetris
from model import Linear_QNet, QTrainer
from helper import plot

MAX_MEMORY = 100_000
BATCH_SIZE = 1000
LR = 0.001
EXPLORE = 80
EXPLOIT = 200


class Agent:
    def __init__(self):
        self.number_games = 0
        self.epsilon = 0
        self.gamma = 0.9  # must be < 1
        self.memory = deque(maxlen=MAX_MEMORY)
        self.model = Linear_QNet(686, 1024, 13)
        self.trainer = QTrainer(self.model, lr=LR, gamma=self.gamma)

    def get_state(self, game):
        state = game.get_game_state()

        # print("State:", json.dumps(state, indent=4))

        game_array = [
            [
                [False for _ in range(state["pile"]["game"]["depth"])]
                for _ in range(state["pile"]["game"]["height"])
            ]
            for _ in range(state["pile"]["game"]["width"])
        ]

        # Set positions of cubes in the pile to True
        for cube in state["pile"]["cubes"]:
            if cube["y"] < 7:
                # print("Cube:", cube)
                game_array[cube["x"]][cube["y"]][cube["z"]] = True

        # Flatten the 3D array into a 1D array
        pile_flattened_array = [
            item
            for sublist1 in game_array
            for sublist2 in sublist1
            for item in sublist2
        ]

        # Initialize 3D array
        game_array = [
            [
                [False for _ in range(state["pile"]["game"]["depth"])]
                for _ in range(state["pile"]["game"]["height"])
            ]
            for _ in range(state["pile"]["game"]["width"])
        ]

        # Set positions of cubes in the piece to True
        for cube in state["cubes"]:
            if cube["y"] < 7:  # this should be trapped in the JS app
                game_array[cube["x"]][cube["y"]][cube["z"]] = True

        # Flatten the 3D array into a 1D array
        piece_flattened_array = [
            item
            for sublist1 in game_array
            for sublist2 in sublist1
            for item in sublist2
        ]

        concatenated_array = pile_flattened_array + piece_flattened_array
        np_array = np.array(concatenated_array, dtype=int)
        # print("Numpy array:", np_array.shape)

        return np_array

    # time.sleep(1)

    def remember(self, state, action, reward, next_state, done):
        self.memory.append((state, action, reward, next_state, done))

    def train_long_memory(self):
        if len(self.memory) > BATCH_SIZE:
            mini_sample = random.sample(self.memory, BATCH_SIZE)
        else:
            mini_sample = self.memory

        states, actions, rewards, next_states, dones = zip(*mini_sample)
        self.trainer.train_step(states, actions, rewards, next_states, dones)

    def train_short_memory(self, state, action, reward, next_state, done):
        self.trainer.train_step(state, action, reward, next_state, done)

    def get_action(self, state):
        # move = {
        #     "drop": True,
        #     "movement": {"x": 0, "y": 0, "z": 0, "pitch": 0, "yaw": 0, "roll": 0},
        # }
        # return move

        # random moves: tradeoff exploration / exploitation
        self.epsilon = EXPLORE - self.number_games
        final_move = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        if random.randint(0, EXPLOIT) < self.epsilon:
            move = random.randint(0, 12)
            print(f"Performing random move: {move}")
            if move == 0:
                final_move[0] = 1
            elif move <= 6:
                final_move[move] = 1
            else:
                final_move[move - 6] = -1

        else:
            state0 = torch.tensor(state, dtype=torch.float)
            prediction = self.model(state0)
            move = torch.argmax(prediction).item()
            # print("Prediction:", prediction)
            print(f"Performing predicted move: {move}")
            if move == 0:
                final_move[0] = 1
            elif move <= 6:
                final_move[move] = 1
            else:
                final_move[move - 6] = -1

        return final_move


def train():
    plot_scores = []
    plot_mean_scores = []
    total_score = 0
    record = 0
    agent = Agent()
    game = Tetris()
    while True:
        time.sleep(4)
        state_old = agent.get_state(game)
        # print("Old state:", state_old)

        final_move = agent.get_action(state_old)
        tetris_move = {
            "drop": True if final_move[0] == 1 else False,
            "movement": {
                "x": final_move[1],
                "y": final_move[2],
                "z": final_move[3],
                "pitch": final_move[4],
                "yaw": final_move[5],
                "roll": final_move[6],
            },
        }

        # print("Final move:", final_move)
        # print("Tetris move:", tetris_move)

        move_result = game.move_piece(tetris_move)
        reward = move_result["move_reward"]
        done = not move_result["game_result"]
        score = move_result["gameScore"]
        # print("Reward:", reward)
        # print("Done:", done)
        # print("Score:", score)
        state_new = agent.get_state(game)

        # train short memory
        agent.train_short_memory(state_old, final_move, reward, state_new, done)

        agent.remember(state_old, final_move, reward, state_new, done)

        if done:
            game.reset()
            agent.number_games += 1
            agent.train_long_memory()
            if score > record:
                record = score
                # agent.model.save()

            print("Game", agent.number_games, "Score", score, "Record:", record)

            plot_scores.append(score)
            total_score += score
            mean_score = total_score / agent.number_games
            plot_mean_scores.append(mean_score)
            plot(plot_scores, plot_mean_scores)


if __name__ == "__main__":
    train()

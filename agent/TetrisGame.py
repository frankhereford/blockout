#!/usr/bin/env python3

import requests
import webbrowser


class Tetris:
    def __init__(self):
        self.reset()
        self.get_game_state()

    def print_self(self):
        print("Game:", self.game)
        print("Pile:", self.pile)
        print("Piece:", self.piece)
        print("Score:", self.score)

    def reset(self):
        url = "http://localhost:3000/api/game/create"
        headers = {"content-type": "application/json"}
        data = {"height": 7, "width": 7, "depth": 7}
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            # print("Game created successfully")
            # print("Response data:", response.json())
            self.pile = response.json()["pile"]["id"]
            self.game = response.json()["id"]
            self.piece = None
            self.score = 0
            url = f"http://localhost:3000/game/{self.game}"
            # webbrowser.open(url)
            b = webbrowser.get("chrome")

            # Open the URL in a new tab. If new is 0, the URL is opened in the same browser window if possible. If new is 1, a new browser window is opened if possible. If new is 2, a new tab is opened if possible.
            b.open(url, new=0)
            print("game:", self.game)
            return response.json()
        else:
            print(f"Failed to create game, status code: {response.status_code}")
            return None

    def move_piece(self, request):
        url = "http://localhost:3000/api/piece/move"
        headers = {"content-type": "application/json"}
        data = {
            "id": self.piece,
            "drop": request["drop"],
            "movement": request["movement"],
        }
        response = requests.post(url, headers=headers, json=data)
        if response.status_code == 200:
            # print("Piece moved successfully")
            return response.json()
        else:
            print(f"Failed to move piece, status code: {response.status_code}")
            return None

    def get_game_state(self):
        url = f"http://localhost:3000/api/game/{self.game}"
        response = requests.get(url)
        if response.status_code == 200:
            # print("Game state retrieved successfully")
            # print("Response data:", response.json())
            self.piece = response.json()["pile"]["pieces"][0]["id"]
            self.score = response.json()["score"]

            url = f"http://localhost:3000/api/piece/{self.piece}"
            response = requests.get(url)
            if response.status_code == 200:
                # print("Piece retrieved successfully")
                return response.json()
            else:
                print(f"Failed to retrieve piece, status code: {response.status_code}")
                return None

        else:
            print(f"Failed to retrieve game state, status code: {response.status_code}")
            return None


if __name__ == "__main__":
    game = Tetris()
    game.get_game_state()
    game.print_self()
    move_results = game.move_piece(
        {
            "drop": True,
            "movement": {"x": 0, "y": 0, "z": 0, "pitch": 0, "yaw": 0, "roll": 0},
        }
    )
    # print("move_results:", move_results)
    game.get_game_state()
    game.print_self()

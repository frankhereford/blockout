import requests
import urllib.parse
import json

# Replace with your actual tRPC endpoint URL
url = "http://localhost:3000/api/trpc/game.get"

# Example payload - modify as needed
payload = {"0": {"json": {"id": "clqr1i3kl000ht38h7uirh3l2"}}}

# Convert the payload to a URL-encoded string
input_str = urllib.parse.quote(json.dumps(payload))
# input_str = "%7B%220%22%3A%7B%22json%22%3A%7B%22id%22%3A%22clqr1i3kl000ht38h7uirh3l2%22%7D%7D%7D"
print(input_str)

# Define the query parameters
params = {"batch": 1, "input": input_str}

print(params)

# Making a GET request to the tRPC endpoint
response = requests.get(url, params=params)

# Handling the response
if response.status_code == 200:
    print("Success:", response.json())
else:
    print("Error:", response.status_code, response.text)

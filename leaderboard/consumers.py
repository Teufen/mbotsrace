# chat/consumers.py
import time
from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json

import threading

class LeaderboardConsumer(WebsocketConsumer):

    t1 = 1

    def connect(self):
        self.room_group_name = 'leaderboard'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        self.t1 = threading.Thread(target=run_background_process)
        self.t1.setDaemon(True)
        # Start YourLedRoutine() in a separate thread
        self.t1.start()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )

    # Receive message from WebSocket
    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        async_to_sync(self.channel_layer.group_send)(
            self.room_group_name,
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    def chat_message(self, event):
        message = event['message']

        # Send message to WebSocket
        self.send(text_data=json.dumps({
            'message': message
        }))

    def poll_message(self,event):
#        text_data_json = json.loads(event)
#        message = text_data_json['message']

        # Send message to room group
        self.send(text_data=json.dumps({
            'message': event
        }))


from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()


def run_background_process():
    # perform complex calculation depending on parameter from simple calculation
    start = True
    while True:
        result = pollButton(start)
        start = not start
        # update frontend via websocket
        async_to_sync(channel_layer.group_send)("leaderboard", {
            "type": "poll_message",
            "text": {
                "result": result,
            }
        })


def pollButton(test):
    time.sleep(5)
    if test:
        return 'start'
    else:
        return 'stop'

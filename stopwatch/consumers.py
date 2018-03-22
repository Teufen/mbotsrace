# chat/consumers.py
import time
# from asgiref.sync import async_to_sync
from channels.generic.websocket import WebsocketConsumer
import json
import threading
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BCM)
GPIO.setup(18, GPIO.IN, pull_up_down=GPIO.PUD_UP)

from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
channel_layer = get_channel_layer()


class LeaderboardConsumer(WebsocketConsumer):

    t1 = threading.Thread()
    stopped = False

    def connect(self):
        self.room_group_name = 'leaderboard'

        # Join room group
        async_to_sync(self.channel_layer.group_add)(
            self.room_group_name,
            self.channel_name
        )

        self.accept()

        print('new connection',LeaderboardConsumer.t1.isAlive())

        # LeaderboardConsumer.stopped = False
        if not LeaderboardConsumer.t1.isAlive():
            LeaderboardConsumer.t1 = threading.Thread(target=self.run_background_process)
            LeaderboardConsumer.t1.setDaemon(True)
            LeaderboardConsumer.t1.start()

    def disconnect(self, close_code):
        # Leave room group
        async_to_sync(self.channel_layer.group_discard)(
            self.room_group_name,
            self.channel_name
        )
        LeaderboardConsumer.stopped = True

    def poll_message(self,event):
        # text_data_json = json.loads(event)
        # message = text_data_json['message']

        # Send message to room group
        self.send(text_data=json.dumps({
            'message': event
        }))

    @staticmethod
    def run_background_process():
        # perform complex calculation depending on parameter from simple calculation
        start = True
        # while LeaderboardConsumer.stopped == False:
        while True:
            result = poll_button(start)
            start = not start
            # update frontend via websocket
            async_to_sync(channel_layer.group_send)("leaderboard", {
                "type": "poll_message",
                "text": {
                    "result": result,
                }
            })

def poll_button(test):
    input_state = GPIO.input(18)
    if input_state == False:
        print('Button pressed')
        time.sleep(0.2)

        if test:
            print('send result: start')
            return 'start'
        else:
            print('send result: stop')
            return 'stop'

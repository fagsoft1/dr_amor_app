from channels.generic.websocket import AsyncWebsocketConsumer
import json


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        print('Conecto')
        await self.channel_layer.group_add(
            'Operativo',
            self.channel_name
        )

        await self.accept()

    async def disconnect(self, close_code):
        print('Desconecto')
        await self.channel_layer.group_discard(
            'Operativo',
            self.channel_name
        )

    # Receive message from WebSocket
    async def receive(self, text_data):
        print('Recibio')
        text_data_json = json.loads(text_data)
        message = text_data_json['message']

        # Send message to room group
        await self.channel_layer.group_send(
            'Operativo',
            {
                'type': 'chat_message',
                'message': message
            }
        )

    # Receive message from room group
    async def chat_message(self, event):
        print('Otro')
        message = event['message']

        # Send message to WebSocket
        await self.send(text_data=json.dumps({
            'message': message
        }))

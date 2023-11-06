from rest_framework import serializers
from .models import Note

class NoteSerializer(serializers.ModelSerializer):

    class Meta:
        model = Note
        fields = ("pk", "note_text", "pub_date", "owner")

class OwnerSerializer(serializers.ModelSerializer):

        class Meta:
            model = Note
            fields = ("pk", "username", "password")
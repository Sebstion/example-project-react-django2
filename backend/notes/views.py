from django.shortcuts import render

from rest_framework import generics
from .serializers import NoteSerializer
from .models import Note
class NoteView(generics.ListAPIView):
    queryset = Note.objects.all()
    serializer_class = NoteSerializer

class NoteCreateView(generics.CreateAPIView):
    serializer_class = NoteSerializer
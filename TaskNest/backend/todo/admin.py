from django.contrib import admin
from .models import Todo

class TodoAdmin(admin.ModelAdmin):
    list_display = ("title", "description", "completed")  # Corrected here

admin.site.register(Todo, TodoAdmin)

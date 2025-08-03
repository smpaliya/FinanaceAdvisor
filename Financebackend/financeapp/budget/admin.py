from django.contrib import admin
from .models import Expense
class UserExpenseAdmin(admin.ModelAdmin):
    list_display = ('id','user','product','moneySpent','category','date') 
# Register your models here.
admin.site.register(Expense, UserExpenseAdmin)
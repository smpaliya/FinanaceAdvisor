from django.db import models
from datetime import datetime
from datetime import date
from django.contrib.auth.models import User

# Create your models here.

def get_default_user():
    user=User.objects.first().id 
    return user if user else None


class Expense(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE,related_name='user_expense')
    product=models.CharField(max_length=255)
    moneySpent=models.DecimalField(decimal_places=3,max_digits=20)
    category=models.CharField(max_length=255)
    date=models.DateField(default=date.today)
    def __str__(self):
        return f'{self.product}+{self.date}'
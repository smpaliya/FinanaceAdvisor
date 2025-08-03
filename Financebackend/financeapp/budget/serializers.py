from rest_framework import serializers
from .models import Expense
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User

class ExpenseSerializer(serializers.ModelSerializer):
    class Meta:
        model=Expense
        fields=['id','user','product','moneySpent','category','date']

class CustomAuthTokenSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, attrs):
        username = attrs.get('username')
        password = attrs.get('password')

        user = User.objects.filter(username=username).first()
        if user and user.check_password(password):
            token, created = Token.objects.get_or_create(user=user)
            return {
                'token': token.key,
                'user': {
                    'id': user.id,
                    'username': user.username
                }
            }
        raise serializers.ValidationError('Invalid username or password')
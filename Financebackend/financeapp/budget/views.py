from django.shortcuts import render
from rest_framework.decorators import api_view
from .serializers import ExpenseSerializer
from .models import Expense
from datetime import datetime
from rest_framework import viewsets,status
from datetime import timedelta
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.authtoken.views import obtain_auth_token
from rest_framework.authtoken.views import ObtainAuthToken
from rest_framework.authentication import TokenAuthentication
from django.views.decorators.csrf import csrf_exempt
from rest_framework.permissions import IsAuthenticated,AllowAny
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth.decorators import login_required
from django.db.models import Sum
from django.db.models.functions import ExtractWeekDay
from django.http import JsonResponse
from .serializers import CustomAuthTokenSerializer
import os
import json
from .process_docs2 import process_urls_and_create_faiss2, query_faiss_index2
FAISS_PATH = os.path.join(os.path.dirname(__file__), "../models/faiss_store_openai")


# Create your views here.
@permission_classes([IsAuthenticated])
@login_required
def home(request):
    return render(request, 'index.html') 


class CustomAuthToken(ObtainAuthToken):
    serializer_class = CustomAuthTokenSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data, context={'request': request})
        serializer.is_valid(raise_exception=True)
        return Response(serializer.validated_data)
    
class ExpenseView(viewsets.ModelViewSet):
    queryset = Expense.objects.all()
    serializer_class=ExpenseSerializer
    authentication_classes = [TokenAuthentication]  # Ensure token-based auth
    permission_classes = [IsAuthenticated] 
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_spending_trend(request):
    user=request.user
    if not user.is_authenticated:
        return JsonResponse({"error": "Authentication required"}, status=401)
    print("user",user)
    print("auth",request.auth)
    # Get the start_date from the query params or default to 30 days back
    days = int(request.GET.get('days', 30))  # Get days or default to 30
    start_date = datetime.today() - timedelta(days=days)
    expenses = Expense.objects.filter(user=user, date__gte=start_date)
    daily_expenses=expenses.values('date').annotate(total=Sum('moneySpent')).order_by('date')
    return Response(daily_expenses)

def get_spending_trend2(user, days=30):
    start_date = datetime.today() - timedelta(days=days)
    expenses = Expense.objects.filter(date__gte=start_date)
    daily_expenses = expenses.values('date').annotate(total=Sum('moneySpent')).order_by('date')
    
    return Response(daily_expenses)

def get_monthly_expenses(user, month=None, year=None):
    if not month:
        month = datetime.today().month
    if not year:
        year = datetime.today().year

    expenses = Expense.objects.filter(date__month=month, date__year=year)
    category_summary = expenses.values('category').annotate(total=Sum('moneySpent'))
    
    return category_summary 

def get_spending_by_weekday(user):
    expenses = Expense.objects.annotate(weekday=ExtractWeekDay('date')).values('weekday').annotate(total=Sum('moneySpent'))
    return expenses  # Returns [{ 'weekday': 2, 'total': 100 }, ...]

def get_daily_spending_alert(user, monthly_budget):
    days_passed = datetime.today().day
    total_spent = Expense.objects.filter(date__month=datetime.today().month).aggregate(Sum('moneySpent'))['moneySpent__sum'] or 0
    avg_daily_spending = total_spent / days_passed
    recommended_daily_limit = monthly_budget / 30

    return {'average_daily': avg_daily_spending, 'recommended_limit': recommended_daily_limit}

def compare_monthly_spending(user):
    today = datetime.today()
    last_month = today.month - 1 if today.month > 1 else 12
    last_year = today.year if today.month > 1 else today.year - 1

    current_spending = Expense.objects.filter(date__month=today.month, date__year=today.year).aggregate(Sum('moneySpent'))['moneySpent__sum'] or 0
    previous_spending = Expense.objects.filter(date__month=last_month, date__year=last_year).aggregate(Sum('moneySpent'))['moneySpent__sum'] or 0

    return {'current_month': current_spending, 'previous_month': previous_spending, 'change': current_spending - previous_spending}

def get_top_spending_categories(user, limit=5):
    expenses = Expense.objects.values('category').annotate(total=Sum('moneySpent')).order_by('-total')[:limit]
    return expenses  # Returns [{ 'category': 'Rent', 'total': 800 }, ...]

@api_view(['GET'])
def get_category_spending(user):
    expenses= Expense.objects.values('category').annotate(total=Sum('moneySpent')).order_by('-total')
    return Response(expenses) 

@csrf_exempt  # Disable CSRF protection (Not needed for API views)
@api_view(['POST'])  # Explicitly allow only POST requests
@permission_classes([AllowAny])
def register_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')
    if not username or not email or not password:
        return Response({'error': 'Please provide all required fields'}, status=status.HTTP_400_BAD_REQUEST)
    if User.objects.filter(username=username).exists():
        return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)
    try:
        user = User.objects.create_user(username=username, email=email, password=password)
        user.save()
        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({'error': str(e)}, status=400)
    

@csrf_exempt
def process_urls(request):
    if request.method == "POST":
        data = json.loads(request.body)
        urls = data.get("urls", [])
        print("inside process_urls views")
        if not urls:
            return JsonResponse({"error": "No URLs provided."}, status=400)

        try:
            message = process_urls_and_create_faiss2(urls, FAISS_PATH)
            return JsonResponse({"message": message})
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)


@csrf_exempt
def ask_question(request):
    if request.method == "POST":
        data = json.loads(request.body)
        question = data.get("question", "")
        if not question:
            return JsonResponse({"error": "No question provided."}, status=400)

        try:
            result = query_faiss_index2(question, FAISS_PATH)
            return JsonResponse(result)
        except Exception as e:
            return JsonResponse({"error": str(e)}, status=500)
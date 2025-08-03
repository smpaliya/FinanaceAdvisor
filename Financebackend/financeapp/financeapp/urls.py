"""
URL configuration for financeapp project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path,include
from rest_framework.routers import DefaultRouter
from budget import views
from rest_framework.authtoken.views import obtain_auth_token
router = DefaultRouter()
router.register(r'smartBudget', views.ExpenseView,'expense')

urlpatterns = [
    path('api/', include(router.urls)),
    path('admin/', admin.site.urls),
    path('',views.home,name='home'),
    path('api/dailyExpense/', views.get_spending_trend, name='get_spending_trend'),
    path('api/categoricalSpending/',views.get_category_spending, name='get_category_spending'),
    path('api/signup/',views.register_user,name='register_user'),
    path('api_token_auth/',views.CustomAuthToken.as_view(),name='api_token_auth'),
    path("api/process-urls/", views.process_urls, name="process_urls"),
    path("api/ask-question/", views.ask_question, name="ask_question"),
    ]

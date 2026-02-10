from django.urls import path
from .views import ComparisonView, RecommendationView

urlpatterns = [
    path('compare/', ComparisonView.as_view(), name='ai_compare'),
    path('recommend/', RecommendationView.as_view(), name='ai_recommend'),
]

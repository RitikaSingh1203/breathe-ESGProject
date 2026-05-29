from django.urls import path
from . import views

urlpatterns = [
    path("pending/", views.pending_records),
    path("approve/<int:pk>/", views.approve_record),
    path("reject/<int:pk>/", views.reject_record),
    path("all/", views.all_records),
]
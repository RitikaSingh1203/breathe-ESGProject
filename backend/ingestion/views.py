from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate

import json

from .models import EmissionRecord


# -------------------------------
# PENDING RECORDS
# -------------------------------
@api_view(['GET'])
def pending_records(request):

    records = EmissionRecord.objects.filter(status='PENDING')

    data = []

    for r in records:
        data.append({
            "id": r.id,
            "plant": r.plant,
            "fuel": r.fuel,
            "quantity": r.quantity,
            "unit": r.unit,
            "scope": r.scope,
            "status": r.status,
            "source": r.data_source.id if r.data_source else None,
            "created_at": r.created_at,
        })

    return Response(data)


# -------------------------------
# APPROVE RECORD
# -------------------------------
@api_view(['POST'])
def approve_record(request, pk):

    record = get_object_or_404(EmissionRecord, id=pk)

    record.status = 'APPROVED'
    record.edited = True
    record.save()

    return Response({
        "message": "Record approved",
        "id": record.id,
        "status": record.status
    })


# -------------------------------
# REJECT RECORD
# -------------------------------
@api_view(['POST'])
def reject_record(request, pk):

    record = get_object_or_404(EmissionRecord, id=pk)

    record.status = 'REJECTED'
    record.edited = True
    record.save()

    return Response({
        "message": "Record rejected",
        "id": record.id,
        "status": record.status
    })


# -------------------------------
# ALL RECORDS
# -------------------------------
@api_view(['GET'])
def all_records(request):

    records = EmissionRecord.objects.all()

    data = []

    for r in records:
        data.append({
            "id": r.id,
            "plant": r.plant,
            "fuel": r.fuel,
            "quantity": r.quantity,
            "unit": r.unit,
            "scope": r.scope,
            "status": r.status,
            "source": r.data_source.id if r.data_source else None,
        })

    return Response(data)


# -------------------------------
# LOGIN API
# -------------------------------
@csrf_exempt
def login_api(request):

    if request.method == "POST":

        try:
            data = json.loads(request.body)

            username = data.get("username")
            password = data.get("password")

            user = authenticate(username=username, password=password)

            if user is not None:

                return JsonResponse({
                    "message": "Login Success",
                    "status": "ok",
                    "username": user.username
                })

            else:

                return JsonResponse({
                    "message": "Invalid credentials",
                    "status": "fail"
                }, status=400)

        except Exception as e:

            return JsonResponse({
                "message": str(e),
                "status": "error"
            }, status=500)

    return JsonResponse({
        "message": "Only POST allowed"
    }, status=405)
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt

@csrf_exempt
def login_api(request):
    if request.method == "POST":
        data = json.loads(request.body)

        username = data.get("username")
        password = data.get("password")

        if username == "admin" and password == "admin123":
            return JsonResponse({"message": "Login Success", "status": "ok"})
        else:
            return JsonResponse({"message": "Invalid credentials", "status": "fail"}, status=400)

    return JsonResponse({"message": "Only POST allowed"}, status=405)
from django.db.models import Q
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail
from django.core.exceptions import ValidationError
from django.utils.crypto import get_random_string
from rest_framework import generics, permissions, status
from rest_framework.authtoken.models import Token
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError as DRFValidationError

from .models import Product, StockMovement
from .serializers import ProductSerializer, StockMovementSerializer


class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username", "")
        password = request.data.get("password", "")
        user = authenticate(request, username=username, password=password)
        if user is None:
            return Response({"detail": "Credenciais inválidas."}, status=status.HTTP_401_UNAUTHORIZED)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get("username", "").strip()
        email = request.data.get("email", "").strip()
        password = request.data.get("password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not username or not email or not password:
            return Response({"detail": "Preencha todos os campos."}, status=status.HTTP_400_BAD_REQUEST)
        if password != confirm_password:
            return Response({"detail": "Senhas não coincidem."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(username=username).exists():
            return Response({"detail": "Nome de usuário já está em uso."}, status=status.HTTP_400_BAD_REQUEST)
        if User.objects.filter(email=email).exists():
            return Response({"detail": "E-mail já cadastrado."}, status=status.HTTP_400_BAD_REQUEST)

        user = User.objects.create_user(username=username, email=email, password=password)
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "username": user.username})


class PasswordResetView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get("email", "").strip()
        if not email:
            return Response({"detail": "Informe o e-mail cadastrado."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email__iexact=email)
        except User.DoesNotExist:
            return Response(
                {"detail": "Se o e-mail estiver cadastrado, você receberá instruções por e-mail."}
            )

        temp_password = get_random_string(10)
        user.set_password(temp_password)
        user.save()

        send_mail(
            subject="Recuperação de senha SAEP",
            message=(
                f"Olá {user.username},\n\n"
                f"Sua senha temporária é: {temp_password}\n"
                "Use essa senha para fazer login e em seguida altere-a." 
            ),
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
        )

        return Response(
            {"detail": "Se o e-mail estiver cadastrado, você receberá instruções por e-mail."}
        )


class ProductListCreateView(generics.ListCreateAPIView):
    queryset = Product.objects.all().order_by("name")
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search", "")
        if search:
            queryset = queryset.filter(Q(name__icontains=search) | Q(description__icontains=search))
        return queryset


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [permissions.IsAuthenticated]


class StockMovementListCreateView(generics.ListCreateAPIView):
    queryset = StockMovement.objects.select_related("product").all().order_by("-timestamp")
    serializer_class = StockMovementSerializer
    permission_classes = [permissions.IsAuthenticated]

    # 🛑 FUNÇÃO PARA CAPTURAR A EXCEÇÃO DE 100 MOVIMENTAÇÕES E ENVIAR O ALERTA AO FRONTEND
    def perform_create(self, serializer):
        try:
            serializer.save()
        except ValidationError as e:
            raise DRFValidationError({"detail": e.message})

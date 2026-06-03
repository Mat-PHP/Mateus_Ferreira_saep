from django.urls import path
from .views import (
    LoginView,
    RegisterView,
    PasswordResetView,
    ProductListCreateView,
    ProductDetailView,
    StockMovementListCreateView,
)

urlpatterns = [
    path("auth/login/", LoginView.as_view(), name="login"),
    path("auth/register/", RegisterView.as_view(), name="register"),
    path("auth/password-reset/", PasswordResetView.as_view(), name="password-reset"),
    path("products/", ProductListCreateView.as_view(), name="product-list-create"),
    path("products/<int:pk>/", ProductDetailView.as_view(), name="product-detail"),
    path("stock-movements/", StockMovementListCreateView.as_view(), name="stock-movement-list-create"),
]

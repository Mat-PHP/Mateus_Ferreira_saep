#!/usr/bin/env python
"""Script de criação e população do banco de dados Django."""
import argparse
import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "backend.settings")
django.setup()

from django.contrib.auth.models import User
from django.core.management import call_command
from rest_framework.authtoken.models import Token
from api_app.models import Product, StockMovement

PRODUCTS = [
    {
        "name": "Caneta Azul",
        "description": "Caneta de tinta azul para escritório.",
        "price": 2.50,
        "quantity": 0,
    },
    {
        "name": "Caderno A4",
        "description": "Caderno com 100 folhas, capa flexível.",
        "price": 12.90,
        "quantity": 0,
    },
    {
        "name": "Mouse USB",
        "description": "Mouse óptico USB com cabo de 1.5m.",
        "price": 39.90,
        "quantity": 0,
    },
    {
        "name": "Teclado Bluetooth",
        "description": "Teclado sem fio com bateria recarregável.",
        "price": 129.90,
        "quantity": 0,
    },
]

STOCK_MOVEMENTS = [
    {"product_name": "Caneta Azul", "movement_type": "IN", "quantity": 100, "note": "Entrada inicial"},
    {"product_name": "Caneta Azul", "movement_type": "OUT", "quantity": 20, "note": "Venda"},
    {"product_name": "Caderno A4", "movement_type": "IN", "quantity": 50, "note": "Reposição"},
    {"product_name": "Mouse USB", "movement_type": "IN", "quantity": 30, "note": "Entrada de estoque"},
    {"product_name": "Teclado Bluetooth", "movement_type": "IN", "quantity": 20, "note": "Entrada de estoque"},
]

USERS = [
    {"username": "admin", "email": "admin@example.com", "password": "Admin@1234", "is_superuser": True, "is_staff": True},
    {"username": "testuser", "email": "testuser@example.com", "password": "Test@1234", "is_superuser": False, "is_staff": False},
]


def create_users():
    created = []
    for user_data in USERS:
        user, created_flag = User.objects.get_or_create(
            username=user_data["username"],
            defaults={"email": user_data["email"], "is_superuser": user_data["is_superuser"], "is_staff": user_data["is_staff"]},
        )
        if created_flag:
            user.set_password(user_data["password"])
            user.is_superuser = user_data["is_superuser"]
            user.is_staff = user_data["is_staff"]
            user.save()
            created.append(user.username)
        else:
            created.append(f"{user.username} (já existe)")
        token, _ = Token.objects.get_or_create(user=user)
        print(f"Token para {user.username}: {token.key}")
    return created


def create_products():
    created = []
    for product_data in PRODUCTS:
        product, created_flag = Product.objects.get_or_create(
            name=product_data["name"],
            defaults={
                "description": product_data["description"],
                "price": product_data["price"],
                "quantity": product_data["quantity"],
            },
        )
        if not created_flag:
            product.description = product_data["description"]
            product.price = product_data["price"]
            product.quantity = product_data["quantity"]
            product.save()
        created.append(product.name)
    return created


def create_stock_movements():
    created = []
    for movement in STOCK_MOVEMENTS:
        try:
            product = Product.objects.get(name=movement["product_name"])
        except Product.DoesNotExist:
            continue
        stock_movement = StockMovement.objects.create(
            product=product,
            movement_type=movement["movement_type"],
            quantity=movement["quantity"],
            note=movement["note"],
        )
        created.append(f"{stock_movement}")
    return created


def main():
    parser = argparse.ArgumentParser(description="Cria e popula o banco de dados do backend Django.")
    parser.add_argument(
        "--skip-movements",
        action="store_true",
        help="Não criar movimentos de estoque, apenas produtos e usuários.",
    )
    args = parser.parse_args()

    print("Verificando e criando migrations do app api_app...")
    call_command("makemigrations", "api_app", interactive=False)
    print("Aplicando migrações...")
    call_command("migrate", interactive=False)

    print("Populando usuários...")
    users = create_users()
    print("Usuários criados/confirmados:", ", ".join(users))

    print("\nPopulando produtos...")
    products = create_products()
    print("Produtos criados/atualizados:", ", ".join(products))

    if not args.skip_movements:
        print("\nPopulando movimentos de estoque...")
        movements = create_stock_movements()
        print("Movimentos criados:", ", ".join(movements))
    else:
        print("\nMovimentos de estoque ignorados.")

    print("\nPopulação concluída.")
    print("Acesse: admin/Admin@1234 ou testuser/Test@1234")


if __name__ == "__main__":
    main()

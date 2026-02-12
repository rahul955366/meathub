docker-compose exec backend python -c "import django; django.setup(); from django.contrib.auth import get_user_model; User = get_user_model(); User.objects.create_superuser('admin', 'admin@example.com', 'admin') if not User.objects.filter(username='admin').exists() else print('Admin exists')"
Write-Host "Admin user created: admin / admin"

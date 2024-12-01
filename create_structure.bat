@echo off
echo Creating ESG SaaS Project Structure...

mkdir backend
cd backend
mkdir app
cd app
mkdir models
mkdir routes
mkdir services
type nul > __init__.py
cd ..
type nul > config.py
type nul > requirements.txt
type nul > run.py
cd ..

mkdir frontend
cd frontend
mkdir public
mkdir src
cd ..

echo Structure created successfully!
pause
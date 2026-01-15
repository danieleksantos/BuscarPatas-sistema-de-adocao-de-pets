@echo off
echo [1/4] Parando containers antigos e limpando volumes...
docker compose down -v

echo [2/4] Construindo imagens (Multi-stage Build)...
docker compose build --no-cache

echo [3/4] Subindo os servicos...
docker compose up -d

echo [4/4] Aguardando banco de dados subir para rodar migrations...
timeout /t 5 /nobreak > nul
docker exec -it buscar-patas-api npx prisma migrate dev --name init_docker
docker exec -it buscar-patas-api npx prisma db seed

echo ======================================================
echo PROJETO BUSCAR PATAS RODANDO!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:3000/pets
echo ======================================================
pause
# QuickVote Backend API

Laravel 10 backend API untuk QuickVote - Sistem voting modern.

## 🚀 Tech Stack

- **Framework**: Laravel 10
- **Database**: MySQL 8.0
- **Authentication**: Laravel Sanctum
- **Containerization**: Docker & Docker Compose

## 📁 Project Structure

```
Quick_vote/
├── backend/              # Laravel API
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   └── Models/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── Dockerfile
│   └── .env.example
├── database/            # MySQL setup
│   └── init.sql
├── frontend/            # React (sudah ada)
└── docker-compose.yml   # Orchestration
```

## 🔧 Setup & Installation

### Prerequisites
- Docker & Docker Compose
- Git

### Step 1: Clone & Setup

```bash
cd "e:/semester 5/Komputasi awan dan distribusi/tubes/Quick_vote"
```

### Step 2: Backend Configuration

```bash
cd backend
cp .env.example .env
```

Edit `.env` jika diperlukan (default sudah sesuai dengan Docker).

### Step 3: Run with Docker Compose

```bash
# Kembali ke root directory
cd ..

# Build dan jalankan semua services
docker-compose up -d --build
```

### Step 4: Verify Services

```bash
# Check running containers
docker ps

# Harusnya ada 3 containers:
# - quickvote_backend (port 8000)
# - quickvote_db (port 3306)
# - quickvote_frontend (port 3000)
```

### Step 5: Test API

```bash
# Test register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Test get candidates
curl http://localhost:8000/api/candidates
```

## 📡 API Endpoints

### Authentication

#### Register
```http
POST /api/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 201
{
  "message": "Register success"
}
```

#### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

Response: 200
{
  "token": "1|xxxxxxxxxxxxx",
  "user": {
    "id": 1,
    "email": "user@example.com"
  }
}
```

### Candidates (Public)

#### Get All Candidates
```http
GET /api/candidates

Response: 200
[
  {
    "id": 1,
    "name": "Candidate A",
    "description": "Visi...",
    "photo": null
  }
]
```

### Candidates (Protected - Requires Auth)

#### Create Candidate
```http
POST /api/candidates
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Candidate D",
  "description": "Visi misi...",
  "photo": "https://example.com/photo.jpg"
}

Response: 201
{
  "message": "Kandidat berhasil ditambahkan",
  "data": {...}
}
```

#### Update Candidate
```http
PUT /api/candidates/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Updated Name"
}
```

#### Delete Candidate
```http
DELETE /api/candidates/{id}
Authorization: Bearer {token}

Response: 200
{
  "message": "Kandidat berhasil dihapus"
}
```

### Voting (Public - No Auth Required)

#### Submit Vote
```http
POST /api/vote
Content-Type: application/json

{
  "email": "voter@example.com",
  "candidate_id": 1
}

Response: 201
{
  "message": "Vote recorded"
}

Error (Duplicate Vote): 422
{
  "message": "The email has already been taken.",
  "errors": {
    "email": ["Email ini sudah melakukan voting"]
  }
}
```

#### Get Results
```http
GET /api/results

Response: 200
[
  {
    "candidate": "Candidate A",
    "votes": 150
  },
  {
    "candidate": "Candidate B",
    "votes": 120
  }
]
```

## 🗄️ Database Schema

### Users Table
```sql
id BIGINT AUTO_INCREMENT PRIMARY KEY
name VARCHAR(255)
email VARCHAR(255) UNIQUE
password VARCHAR(255)
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Candidates Table
```sql
id BIGINT AUTO_INCREMENT PRIMARY KEY
name VARCHAR(255)
description TEXT NULLABLE
photo VARCHAR(255) NULLABLE
created_at TIMESTAMP
updated_at TIMESTAMP
```

### Votes Table
```sql
id BIGINT AUTO_INCREMENT PRIMARY KEY
email VARCHAR(255) UNIQUE  -- One email = one vote
candidate_id BIGINT (FK → candidates.id)
voted_at TIMESTAMP
created_at TIMESTAMP
updated_at TIMESTAMP
```

## 🔒 Security Features

- ✅ Password hashing with bcrypt
- ✅ Laravel Sanctum token-based auth
- ✅ CORS protection (allowing localhost:3000)
- ✅ Email unique constraint (prevent duplicate votes)
- ✅ SQL injection protection (Eloquent ORM)
- ✅ Input validation on all requests

## 🐳 Docker Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f backend

# Rebuild containers
docker-compose up -d --build

# Access backend container
docker exec -it quickvote_backend bash

# Run migrations manually
docker exec -it quickvote_backend php artisan migrate

# Run seeders manually
docker exec -it quickvote_backend php artisan db:seed
```

## 🧪 Manual Testing

### Using Postman

1. **Import Collection**: Create a new Postman collection
2. **Environment Variables**:
   - `base_url`: `http://localhost:8000/api`
   - `token`: (will be set after login)

3. **Test Flow**:
   ```
   1. POST {{base_url}}/register → Register user
   2. POST {{base_url}}/login → Get token
   3. GET {{base_url}}/candidates → View candidates
   4. POST {{base_url}}/vote → Submit vote (no auth)
   5. GET {{base_url}}/results → View results
   6. POST {{base_url}}/candidates → Create candidate (with token)
   ```

## 📝 Important Notes

### Voting Logic
- ⚠️ **Public voting**: Tidak perlu login untuk vote
- ✅ **Email required**: Email digunakan untuk tracking
- ✅ **One vote per email**: Unique constraint pada votes.email
- ❌ **No duplicate votes**: Validation akan reject jika email sudah vote

### Frontend Integration
- Frontend expects token di response login
- Token disimpan di localStorage (frontend side)
- Base URL API: `http://localhost:8000/api`
- CORS sudah dikonfigurasi untuk `http://localhost:3000`

## 🛠️ Troubleshooting

### Database Connection Error
```bash
# Check if database container is running
docker ps | grep quickvote_db

# Check database logs
docker logs quickvote_db

# Restart database
docker-compose restart database
```

### Migration Error
```bash
# Fresh migrate (WARNING: deletes all data)
docker exec -it quickvote_backend php artisan migrate:fresh --seed
```

### Permission Error
```bash
# Fix storage permissions
docker exec -it quickvote_backend chown -R www-data:www-data /var/www/storage
```

## 👨‍💻 Development

### Run Migrations
```bash
docker exec -it quickvote_backend php artisan migrate
```

### Create New Migration
```bash
docker exec -it quickvote_backend php artisan make:migration create_example_table
```

### Run Seeders
```bash
docker exec -it quickvote_backend php artisan db:seed
```

### Clear Cache
```bash
docker exec -it quickvote_backend php artisan cache:clear
docker exec -it quickvote_backend php artisan config:clear
```

## 📦 Production Deployment

### Using Docker Swarm

```bash
# Initialize swarm
docker swarm init

# Deploy stack
docker stack deploy -c docker-compose.yml quickvote

# Check services
docker stack services quickvote

# Remove stack
docker stack rm quickvote
```

## 📄 License

MIT License - QuickVote 2024

## 🤝 Support

Untuk pertanyaan atau issue, silakan buat issue di repository ini.

---

**Happy Coding! 🚀**

# Required Packages

---

## Node.js Packages

### Install All at Once
```bash
npm install express cors dotenv pg bcryptjs jsonwebtoken nodemailer socket.io multer csv-parse uuid
```

### Dev Dependencies
```bash
npm install --save-dev nodemon
```

### Individual Install Commands
```bash
npm install express          # Web framework
npm install cors             # Cross-Origin Resource Sharing
npm install dotenv           # Environment variables from .env
npm install pg               # PostgreSQL client
npm install bcryptjs         # Password hashing
npm install jsonwebtoken     # JWT auth tokens
npm install nodemailer       # SMTP email sending
npm install socket.io        # Real-time WebSocket server
npm install multer           # File upload handling
npm install csv-parse        # CSV file parsing
npm install uuid             # UUID generation
```

---

## .NET Packages (NuGet)

### Install All at Once
```bash
dotnet add package Dapper --version 2.1.35
dotnet add package Npgsql --version 9.0.3
dotnet add package BCrypt.Net-Next --version 4.0.3
dotnet add package System.IdentityModel.Tokens.Jwt --version 8.16.0
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer --version 10.0.5
dotnet add package MailKit --version 4.12.1
dotnet add package CsvHelper --version 33.0.1
dotnet add package DotNetEnv --version 3.1.1
dotnet add package Microsoft.AspNetCore.OpenApi --version 10.0.3
```

### Individual Install Commands
```bash
dotnet add package Dapper                                            # Lightweight ORM (replaces pg)
dotnet add package Npgsql                                            # PostgreSQL driver
dotnet add package BCrypt.Net-Next                                   # Password hashing (replaces bcryptjs)
dotnet add package System.IdentityModel.Tokens.Jwt                   # JWT tokens (replaces jsonwebtoken)
dotnet add package Microsoft.AspNetCore.Authentication.JwtBearer     # JWT middleware
dotnet add package MailKit                                           # SMTP email (replaces nodemailer)
dotnet add package CsvHelper                                         # CSV parsing (replaces csv-parse)
dotnet add package DotNetEnv                                         # .env loader (replaces dotenv)
dotnet add package Microsoft.AspNetCore.OpenApi                      # Swagger/OpenAPI docs
```

### Already Built Into ASP.NET Core (no install needed)
```
SignalR          → replaces socket.io        (built-in)
IFormFile        → replaces multer           (built-in)
Controllers      → replaces express          (built-in)
CORS middleware  → replaces cors             (built-in)
Guid.NewGuid()   → replaces uuid             (built-in)
```

---

## React Client Packages

### Install All at Once
```bash
npm install react react-dom react-router-dom axios socket.io-client lucide-react framer-motion recharts zustand react-hot-toast papaparse react-dropzone date-fns clsx
```

### Dev Dependencies
```bash
npm install --save-dev vite @vitejs/plugin-react tailwindcss @tailwindcss/vite eslint
```

### If Switching to SignalR (for .NET server)
```bash
npm install @microsoft/signalr
```

---

## Quick Setup Commands

### Node Server
```bash
cd node
npm install
npm run dev
```

### .NET Server
```bash
cd dotnet
dotnet restore
dotnet run
```

### React Client
```bash
cd client
npm install
npm run dev
```

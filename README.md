<h1 align="center">Keto Bakery NodeJS Task</h1>
<p align="center">This project provides an API to manage Original Products and Modified Products tables, allowing you to populate, sync, and manage products with price adjustments (21% VAT).</p>

## Technologies Used
- Node.js
- Express.js
- PrismaORM

## Setup
Clone the repository:

```bash
https://github.com/RafaelPil/Keto-Bakery-Task.git
```

Install Node modules:
```bash
npm install
```

Run the server:
```bash
npm run dev
```

## API Endpoints:
- Populate Products: POST /populate-original
- Sync Products: POST /sync-to-modified?minPrice=`minPrice`
- View Products: GET /original or GET /modified

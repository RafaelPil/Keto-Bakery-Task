Keto Bakery NodeJS užduotis

## Technologies Used
- Node.js
- Express.js
- Prisma ORM

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
- Sync Products: POST /sync-to-modified?minPrice=<minPrice>
- View Products: GET /original or GET /modified

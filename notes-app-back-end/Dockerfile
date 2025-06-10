# Gunakan base image Node.js
FROM node:18-alpine

# Set working directory di dalam container
WORKDIR /app

# Salin file dependency
COPY package*.json ./

# Install dependency (production only bisa diubah kalau mau testing)
RUN npm install

# Salin semua source code
COPY . .

# Expose port Hapi.js (ganti sesuai port project kamu)
EXPOSE 5000

# Jalankan aplikasi
CMD ["npm", "start"]

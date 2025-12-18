# Use Node.js image
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy package files
COPY package.json pnpm-lock.yaml ./

COPY prisma ./prisma

# Install all dependencies
RUN pnpm install

# Copy the rest of the code
COPY . .

# Expose port 3000
EXPOSE 3000

# Start the app in development mode
CMD ["pnpm", "run", "dev"]

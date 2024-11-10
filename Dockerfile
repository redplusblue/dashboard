# Use Node.js as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy backend and frontend files
COPY Backend Backend
COPY Frontend Frontend
COPY Minecraft Minecraft

# Install dependencies and build the frontend and Minecraft views
RUN cd Frontend && npm install && npm run build
RUN cd Minecraft && npm install && npm run build
# Move backend files to root
RUN mv Backend/* . && rm -rf Backend 
# install required packages
RUN npm install child_process express systeminformation fs && npm install -g nodemon 

# Expose the port the backend server will run on
EXPOSE 3103

# Start the backend server
CMD ["nodemon"]

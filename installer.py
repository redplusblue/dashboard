# Simple install script for the HomeServer Dashboard
# Steps: 
# 1. Install the necessary packages in the frontend and backend directories using npm install.
# 2. Build the frontends using npm run build. 
# 3. Move the backend files to the correct location. 
import os

# Check if npm and nodejs are installed
npm = os.system("npm -v")
node = os.system("node -v")
if npm != 0 or node != 0:
    print("Please install npm and nodejs before running this script.")
    exit(1)
    
# Install the necessary packages in the ./Frontend directory
try:
    os.chdir("Frontend")
    os.system("npm install")
    os.system("npm run build")
    os.chdir("..")
except Exception as e:
    print("Error installing frontend packages: ")
    print(e)
    exit(1)
# Install the necessary packages in the ./Minecraft directory
try:
    os.chdir("Minecraft")
    os.system("npm install")
    os.system("npm run build")
    os.chdir("..")
except Exception as e:
    print("Error installing Minecraft packages: ")
    print(e)
    exit(1)

# Move the backend files to the correct location
try:
    os.system("cp -r Backend/* ." )
    os.system("rmdir Backend")
except Exception as e:
    print("Error moving backend files: ")
    print(e)
    exit(1)
    
print("Installation complete. Run the server using node server.js.")
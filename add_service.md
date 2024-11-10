### How to add a new service (icon) to the dashboard 
1. Clone this repository.
2. Grab the icon of the service you want to add. 
3. Add the icon to the `Frontend/src/assets/icons` directory.
4. Open the script `Frontend/src/scripts/icons.js` and add the line
    ```javascript
    export { default as SERVICENAME } from "../assets/icons/ICONNAME.svg";
    ```
    Replace `SERVICENAME` with the name of the service and `ICONNAME` with the name of the icon file.

**IMPORTANT**: The name of the icon file should be the same as the name of the service in serviceInfo.json. This is how the icon is automatically assigned to the service.

5. Go to the Frontend directory and run the following command:
    ```bash
    npm run build
    ```
6. Go back to the root directory and run the following command:
    ```bash
    docker build -t redplusblue/dashboard:latest .
    ```

7. Run the following command to test the dashboard:
    ```bash
    docker run -d -p 3020:3020 -v $(pwd)/serverInfo.json:/app/Frontend/src/data/serverInfo.json redplusblue/dashboard:latest
    ```
8. Open the browser and go to `http://localhost:3020` to see the dashboard. If you see the new icon, you have successfully added a new service to the dashboard.

9. Create a pull request with the changes you made (Optional).

### Alternative Method (Using exec)
1. Run `docker ps` to get the container ID of the dashboard.
2. Using that container ID, run the following command:
    ```bash
    docker exec -it CONTAINER_ID sh
    ```
3. Install nano and curl using the following commands:
    ```bash
    apk update
    apk add nano 
    apk add curl
    ```
4. Go to the Frontend/src/assets/icons directory and upload the icon file using the following command:
    ```bash
    curl -o ICONNAME.svg https://URL_TO_ICON
    ```
5. Open the script `Frontend/src/scripts/icons.js` using nano:
    ```bash
    nano Frontend/src/scripts/icons.js
    ```
6. Add the line
    ```javascript
    export { default as SERVICENAME } from "../assets/icons/ICONNAME.svg";
    ```
    Replace `SERVICENAME` with the name of the service and `ICONNAME` with the name of the icon file.

7. Since nodemon is running, the changes will be automatically reflected in the dashboard. If not, run the following command:
    ```bash
    npm run build
    ```

8. Create a pull request with the changes you made (Optional).
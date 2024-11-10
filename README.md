## Dashboard

Dashboard page for my HomeServer.

### Preview: [Try it out](https://redplusblue.github.io/dashboard/)

#### Dashboard

<img src="preview/preview.png"></img>

#### Minecraft

<img src="preview/minecraft.png"></img>

### Features

1. Looks good (Subjective)
2. Shows a list of all the services running on the server with their status.
3. Shows the current CPU and Memory usage of the server using the nodejs `systeminformation` library.

### How to use - Easy Version

#### Docker Compose: (Recommended)

1. Create a new directory and create a `docker-compose.yml` file in it. Add the following code to the file:

```yaml
services:
  dashboard:
    image: redplusblue/dashboard:latest
    network_mode: "host"
    volumes:
      - ./serverInfo.json:/app/Frontend/src/data/serverInfo.json
    environment:
      - PORT=3020
```

2. Create a `serverInfo.json` file in the same directory and add the following code:

```json
[
  {
      "Server": "Server Purpose",
      "Name": "Server Name",
      "Link": "Server Link",
      "Status": "Online"
  }, 
  {
      "Server": "Server Purpose",
      "Name": "Server Name",
      "Link": "Server Link",
      "Status": "Online"
  }
]
```
You can add as many services as you want. Just copy the object inside the `services` array and paste it below the last object. Here is a [sample file](serverInfo.json).

3. Run the following command in the terminal:

```bash
docker-compose up -d
```

4. NOTE: If you are using a firewall, make sure to open the port `3020` for the dashboard. You can access the dashboard at `http://localhost:3020`. If you are using a different port, replace `3020` with the port you are using.   

###### [How to use - Hard Version](install_hard.md)

### Pitfalls (So far)
1. Self signed certificates are not supported. The URL will show as Offline if you are using a self signed certificate.
2. The serverInfo.json file should be in the same directory as the docker-compose.yml file. If you want to use a different location, you will have to change the volume mapping in the docker-compose.yml file.
3. The number of icons is limited. If you want to add a new service, use this [tutorial](add_service.md).

### Credits

- Official applications for the icons.
- Google Fonts for the fonts.
- and to everything else that I might have missed.

### Contributing

Feel free to contribute to the project. If you have any suggestions or want to add a feature, feel free to open an issue or a pull request.

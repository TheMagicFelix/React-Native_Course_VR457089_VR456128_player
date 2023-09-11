# React-Native_Course_VR457089_VR456128_player
 
## How to run Backend
Download the Docker Image here: `https://univr-my.sharepoint.com/:u:/g/personal/florenc_demrozi_univr_it/EVZbWRfC9rpLjVYSYfdZPRoBxH_xmVWYlI4I4zc4dgM4yw?e=ZtWNEH`. 

If not familiar with Docker check out this guide: `https://docs.docker.com/engine/reference/commandline/load/`

After having loaded the image, you can run the image with:

`docker run -p 0.0.0.0:5001:5000 docker-jp-backend:latest`

If you are using a mac M1, you will need to add the flag `--platform=linux/amd64` in your `docker run` command.

If you use `docker-compose`, remember to expose the port `5001` and bind it to the container port `5000`.

## How to run the doctor's web app
- `cd web-app`
- `nvm use 16`
- `yarn`
- create a file named `.env.development.local` containing the following:

```
REACT_APP_API_KEY=AIzaSyAEG0tZy1RvswIX9c4Z3kgYzP4cUe9tgZI
REACT_APP_AUTH_DOMAIN=jp-obesity-dev.firebaseapp.com
REACT_APP_PROJECT_ID=jp-obesity-dev
REACT_APP_STORAGE_BUCKET=jp-obesity-dev.appspot.com
REACT_APP_MESSAGING_SENDER_ID=531756904425
REACT_APP_ID=1:531756904425:web:954a9b95fdf05c05462578
REACT_APP_DATABASE_URL=https://jp-obesity-dev-default-rtdb.europe-west1.firebasedatabase.app
REACT_APP_MEASUREMENT_ID=G-34VEZNGXW2
REACT_APP_SERVER_URL=http://localhost:5001/
```
- `yarn start`

Log in with mail: `test.doc@mail.com` and password: `password`

## Log in into the mobile app
#### In order to use this app you will need Java 11 and NodeJS 16.x

- `cd mobile-app`
- `npm install --legacy-peer-deps`
- Edit the `ip` parameter in the `config.js` file and match it to the local network ip of the machine running the backend
- `npm run android` if using an Android Device or `npm run ios` if using an iOS device
- Log in with mail: `test.pz@mail.com` and password: `psw`

If you encounter "Nessuna connessione" or "DBG login error Error: Network Error", it probably means that the device you are using is not able to reach the backend service. You will need to check the correctness of `config.js` or try using a real device connected to the same Wifi Network.

## How to work on this project
Create your own branch from main, your brach should be named as: `<MATRICOLA>_<PROJECT_ID>` where preject ids are one of the following:
- chat
- player
- notification_history

Check out your brach and start working on your project :)

## Any question
Mail me at: `cristian.turetta@univr.it`

# pixel-workplace - Server

![Build](https://github.com/luanpotter/pixel-workplace/workflows/Build/badge.svg?branch=master&event=push)

Pixel Workplace is a simple virtual environment to simulate the lack of real life office spaces.

## Minimum Requirements

- **Node: 12.13+**

## How to run the application?

### Install Dependencies

`npm install`

### Run application

`npm start`

### Auto Reload

`npm run dev`

### Lint

`npm run lint` AND `npm run fix`

##Docker

At the root of the **server folder**:

`docker build -t 'image name' .` to build image

`docker run -p 3000:3000 'image name'` to run image

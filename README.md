# Ignite Call 🗓📞

This project is a full stack application developed with **Next.js** to **make schedulings and connect your Google Calendar**, so that other people can book times with you in their free time. This project was developed during the **React.js** trail of [**Rocketseat**](https://github.com/rocketseat-education) **Ignite** specialization program.

[**Click here to use the application!**](https://ignite-call-luismda.vercel.app/)

[**Click here to see the full design on Figma!**](https://www.figma.com/file/85WPTiRrnXnWlreexiAiEt/Ignite-Call-(Community)?type=design&node-id=0-1)

This app is also built around a complete **Design System developed with Storybook** and the package with React components and tokens for colors, sizes, fonts, spacing, and more. This Design System was also developed by me and you can access it below.

[**Click here to access the Design System repository!**](https://github.com/luismda/ignite-ui-design-system)

## Instructions

First, clone the repository and then install the dependencies:

```sh
npm i
```

Now, you need to create the `.env` file in the root of the project, following the same variables that are in the `.env.example` file.

### Important

To connect to the database you need to fill in the `DATABASE_URL`. In this project, I'm using **MySQL** and I suggest you use **Docker** to up the container with MySQL. To do so, just run the **Docker Compose** command in the root of the project, based on the `docker-compose.yml` file.

```sh
# start docker container
docker compose up -d
```

Don't forget to run the migrations to create the tables in the database.

```sh
npx prisma migrate deploy
```

If you want, you can also run the command below to view the database through Prisma Studio.

```sh
npx prisma studio
```

Also, you need to get Google oAuth client credentials which are `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`. You can refer to that [**documentation**](https://developers.google.com/identity/protocols/oauth2) for more details.

Finally, it is necessary to inform the `NEXTAUTH_SECRET`, which is used by **Next Auth** to generate **JWT** tokens. This value can be any string, but if you are on a **Linux** or **Mac** environment, you can run this command below to generate a random value.

```sh
openssl rand -base64 32
```

Now just run the project and be happy! (I hope... 🥹)

```sh
npm run dev
```

## About project

The main objective of this application is that a user can connect their **Google Calendar** and **define their availability for days and times throughout the week**. In this way, this user has access to their single schedule page, which can be sent so that other people can book with this user. When an scheduling is confirmed, the user will receive an event in their Google Calendar, already with a **Google Meet** call scheduled with the other person who requested the scheduling. 

All this happens through **social authentication with the Google account**, using the **oAuth** protocol, and integration with the **Google Calendar API**, which can be accessed according to the permission granted by the user.

An interesting feature of this application is that it was **developed in a single code base**, that is, the **front-end is together with the back-end in the same project**. This was made possible through the **API Routes**  feature of **Next.js**. **SSR (Sever Side Rendering) and SSG (Static-Site Generation)** resources were also used on some pages.

This project had several validations of dates and times to block dates from the past, block days without user availability, among other things. On the front-end, the integration of **Zod** with the **React Hook Form** helped in this process of validations and data processing. In addition, **React Query** provided more performance in the application, since it keeps the request cache, making the search for information faster.

Using **Next SEO**, it was also possible to implement some **SEO** adjustments on the pages, such as customizing the title and description of each page, in addition to configuring the **Open Graph**.

### Authentication

The authentication flow was built with the help of **Next Auth**, which automated much of the social authentication process with Google provider. Even so, it was necessary to create a **customized Prisma Adapter** to meet the specific needs of the application. The protocol used was **oAuth**, which allows a user to grant access to certain features of their account in a provider such as Google, GitHub, Discord, LinkedIn, among others.

### Database

In the database part of the project, **MySQL** was used together with **Prisma ORM**. **Docker** was also used to run a MySQL container in a development environment. Also, in production the application is using the **PlanetScale** database service.

### Deploy 

The project was deployed on the **Vercel** platform. As it is a Next.js project, Vercel offers better performance for both the front-end and the back-end, which uses the serverless model.

### Technologies

- TypeScript
- React.js
- React Hook Form
- React Query
- React Loading Skeleton
- Next.js
- Next Auth
- Next SEO
- Stitches
- Zod
- Axios
- Prisma ORM
- MySQL
- Docker
- PlanetScale
- ESLint
- Vercel

## Created by

Luís Miguel | [**LinkedIn**](https://www.linkedin.com/in/luis-miguel-dutra-alves/)

##

**#NeverStopLearning 🚀**
# PrismaRedisTemplateApp

Simple Node&Express application with Prisma ORM and Redis. Was made like a template. Will be updated and documented, to save best practices for future

## Commands to start with this project
> [!WARNING]
> Before using the commands read the instructions below

```
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```
First command will init prisma project. It will add **.env** file and a **prisma** folder. <br>
Secons command will create a database, which was provided in database URL. Better to provide new database, because old one can be corrupted in the process. Also we can migrate projects from Sequelize and Mongoose.
<br>
Third command will generate a project and install all dependencies
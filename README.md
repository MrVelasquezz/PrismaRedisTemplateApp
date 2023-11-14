# PrismaRedisTemplateApp

Simple Node&Express application with Prisma ORM and Redis. Was made like a template. Will be updated and documented, to save best practices for future

## Commands to start with this project
> [!WARNING]
> Before using the commands read the instructions below!

```
npx prisma init
npx prisma migrate dev --name init
npx prisma generate
```
1. Command will init prisma project. It will add **.env** file and a **prisma** folder.
2. Command will create a database, which was provided in database URL. Better to provide new database, because old one can be corrupted in the process. Also we can migrate projects from Sequelize and Mongoose.
3. Command will generate a project and install all dependencies

## ENV variables

```
POSTGRES_URL="postgresql://[username]:[password]@[host]:[port]/[db_name]"
REDIS_URL="redis://[username]:[password]@[host]:[port]"
```
> [!NOTE]
> Default username in redis is 'default'
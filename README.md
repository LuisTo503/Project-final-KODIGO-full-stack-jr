# proyecto final KODIGO full stack jr


## para probar este proyecto de forma local porfavor siga las siguientes instrucciones

1. primero clone el repositorio con el siguiente comando

```bash
git clone https://github.com/EzequielMisterLinux/Project-final-KODIGO-full-stack-jr.git
```

2. ahora vaya a la ruta o a la carpeta que se acaba de crear

```bash
cd Project-final-KODIGO-full-stack-jr
```

3. muy bien ahora instale las respectivas dependencias del proyecto con el siguiente comando


```bash
composer install
```

4. muy bien ahora copie el .env.example lo pega en la raiz del proyecto y finalmente lo renombra como .env

5. excelente ahora hay que preparar la base de datos porfavor cree una base de datos en mysql y modifique las siguientes variables de entorno en el .env


## ⚠️ Importante: asegurese de editar estas variables de entorno segun a la base de datos que se va a conectar.

- si es local entonces asegurese de que estas variables coincidan con la información de ese gestor de base de datos

- si es en la nube vaya a su servicio cloud y asegurese de apuntar bien al host y configurar correctamente las env de aca


```bash
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=laravel_crud
DB_USERNAME=admin
DB_PASSWORD=123456
```

- si es con docker entonces solo copie estas variables de entorno vaya al .env y reemplazelas por estas ahora bien, si va a usar docker simplemente ejecute el siguiente comando


```bash
docker compose up -d
```

- se empezara a crear una instancia de mysql y ya tendrá lista la base de datos


6 .muy bien si ya tenemos la base de datos entonces hagamos las primeras configuraciones globales, primero ejecute el siguiente comando

```bash
php artisan key:generate
```

- este comando generará la llave de su proyecto de laravel

- ahora ejecute el siguiente comando

```bash
php artisan jwt:secret
```

- este comando creará una key segura para jsonwebtoken


- excelente ahora haga las migraciones a la base de datos

```bash
php artisan migrate
```

- excelente ahora genere un factory de roles

```bash
php artisan migrate:fresh --seed
```

- este comando creará 3 tipos de roles
1. admin
2. editor
3. user
-

7. ahora si muy bien puede iniciar el proyecto con el siguiente comando


```bash
php artisan serve 
```


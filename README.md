# Django Nearly-SOLID framework

## Введение

Django-NS-framework - это надстройка над Django, предоставляющая ряд паттернов для упрощенного построения хорошей
архитектуры приложения.

Вам следует использовать это, если имеются претензии к высокой связанности кода в **Django REST framework** как его альтернативу.

## Основные принципы

### Отделение логики от данных

Есть несколько вариантов того, где разместить логику нашего приложения на Django. Документация Django говорит, что
наиболее разумным вариантом будет положить бизнес-логику в модель. Однако этот подход имеет минусы. Основной -
перемешивание
данных и логики.

При использовании Django-NS мы рекомендуем выделять отдельные классы для логики и отдельные - для данных.

#### Плохой пример:

```python
# models.py
from django.db import models


class Order(models.Model):
    ...  # декларация данных заказа

    @staticmethod
    def pay_for_order(order_id: int, some_data: dict) -> 'Order':
        """Какая-то бизнес-логика"""

```

#### Хороший пример:

```python
# models.py
from django.db import models


class Order(models.Model):
    ...  # декларация данных заказа


# services.py
class OrdersService:
    def pay_for_order(self, order_id: int, some_data: dict) -> Order:
        """Какая-то бизнес-логика"""

```

### Слои абстракции

Слой абстракции - это способ сокрытия деталей реализации функционала.

Обычно в веб-приложении мы можем выделить три слоя абстракции:

- Слой базы данных (Database layer) - слой, на котором происходит сохранение/изменение данных в хранилище.
  Ничего не знает о других слоях
- Слой бизнес-логики (Business logic layer) - слой с деталями реализации бизнес-логики.
  Знает о слое БД (оперирует django-моделями), ничего не знает об адаптерах/интерфейсах.
- Слой адаптеров (Adapters layer) - слой с деталями реализации не-бизнесовой части логики.
  Знает о бизнес-логике и БД.

Общение между слоями происходит с помощью интерфейсов. Таким образом, чтобы слой бизнес-логики смог обратиться в адаптер
(например отправить имэйл), ему нужно знать только про интерфейс, но не про реализацию адаптера. Интерфейс при этом
будет лежать на том же слое, где используется, а его реализация - слоем выше. Чтобы подставить имплементацию интерфейса
необходимо использовать механизм подстановки зависимостей (dependency injection).

## Dependency injection

В упрощенном виде вы можете рассматривать подстановку зависимостей как словарь, ключи которого - интерфейсы, а
значения - их имплементации. Механизм DI дает возможность подставить имплементацию интерфейса.

Отдельно мы декларируем контейнер, в котором сопоставляем интерфейсы к их имплементации. Контейнеры как правило
соотносятся с конфигурациями запуска. В зависимости от контейнера имплементации одних и тех же интерфейсов могут быть
разными.

К примеру, если мы хотим запускать несколько разных API (в микросервисах очень частая потребность), то для одного из
API сервис будет дефолтной имплементации с бизнес-логикой, а для другого - нагенерированной имплементацией, построенной
на сетевых запросах на вызов этого метода из первого API.

#### Пример использования DI:

Допустим, имеем интерфейс:
```python
# shop/image_storage.py
from abc import ABC, abstractmethod


class IImageStorage(ABC):
    @abstractmethod
    def upload_image(self, file: bytes) -> str:
        """
        Метод, загружающий файл в хранилище
        :returns: ID файла в хранилище
        """
```

И его имплементацию:
```python
# adapters/image_storage.py
class DepotImageStorage(IImageStorage):
    def upload_image(self, file: bytes) -> str:
        """
        Реализация, построенная на специфичной для задачи библиотеке
        """

```

Декларируем контейнер:

```python
# shop/container.py
from adapters.image_storage import FileSystemImageStorage
from ns.di.abc import Container
from shop.image_storage import IImageStorage


class ShopContainer(Container):
    images_storage: IImageStorage = FileSystemImageStorage()


```

И используем в сервисе:

```python
# shop/services.py
from typing import IO

from ns.di import depends


class ShopService:
    image_storage: IImageStorage = depends(IImageStorage)

    def set_product_image(self, product_id: int, file: IO):
        # Какая-то логика обработки товара
        file_id = self.image_storage.upload_image(file.read())  # Вызовется метод DepotImageStorage.upload_image
        print(isinstance(self.image_storage, DepotImageStorage))
        # Напечатает True, но так делать не нужно - этот слой не должен импортировать и использовать имплементацию

```

## Работа с данными

Мы предполагаем, что данные могут быть следующих видов:

- Все стандартные типы Python
- Django-модели
- Pydantic-модели
- Датаклассы
- Enum

Все сложные структуры данных (не стандартные типы) будем называть **сущностями (entities)**.

Для pydantic-моделей и датаклассов предполагается использовать файл `entities.py`. Для Enum'ов - `enums.py`

При этом использовать pydantic нужно только в том случае, если предполагается валидация сущностей. Если вы хотите просто
задекларировать сущность, используйте dataclass.

## Обработка ошибок

Для исключений используются наследники класса `ns.errors.Error`.
В нем используются коды ошибок, декларирующиеся отдельно как string enum.

## Пользователи

Django предоставляет стандартный пакет `django.contrib.auth`, реализующий базовую модель данных для пользователя и
метод для авторизации пользователя.

Когда мы пишем код, обычно мы привыкли получать данные пользователя в `View` из обьекта `HttpRequest`:

```python
from django.views import View
from django.http import HttpRequest


class SomeView(View):
    def get(self, request: HttpRequest):
        user = request.user  # Обычно мы делаем так

```

Но View - это обработчик HTTP-запросов. Так это специфичная для транспорта часть приложения,
мы не хотим писать тут бизнес-логику. Вместо этого логику мы пишем в сервисах.

### Использование юзеров в сервисах

Т.к. передача в каждый отдельный метод сервиса авторизованного юзера - это шаблонный код, есть возможность
использовать юзеров из переменных контекста. Для этого:

Подключите middleware для аутентификации из NS вместо стандартного:

```python
# settings.py
MIDDLEWARE = [
    ...,
    'ns.auth.middleware.AuthenticationMiddleware',  # вместо 'django.contrib.auth.middleware.AuthenticationMiddleware'
    ...,
]
```

Используйте предоставленную переменную контекста в коде сервиса:

```python
from ns.auth.contextvars import authorized_user


class Service(...):
    def get_order(self, order_id: int) -> 'Order':
        user = authorized_user.get()
        # Логика с использованием юзера
```

Хотя ничего не мешает вам использовать `authorized_user` внутри адаптеров, все же, мы не рекомендуем этого делать -
логика, связанная с пользователем - часть бизнес-логики и предпочтительнее ей находиться именно в сервисах.

### Проверка авторизации

Для того, чтобы не дать неавторизованному пользователю вызвать определенный метод, вы можете использовать декоратор
`auth_required`. Тогда, если пользователь на аутентифицирован, будет выброшена ошибка авторизации.

```python
from ns.auth.decorators import auth_required
from ns.auth.contextvars import authorized_user


class Service(...):
    @auth_required
    def get_order(self, order_id: int) -> 'Order':
        user = authorized_user.get()
        # Логика с использованием юзера
```


## AutoAPI

Так как методы сервисов - это по сути методы бизнес-логики, часто бывает удобно сгенерировать из них API
для вызова их из других сервисов, находящихся в других процессах, либо вообще с фронтенда на JavaScript.

Чтобы приложение корректно сгенерировало API, унаследуйте ваш Django Application от
`ns.autoapi.apps.AutoApiConfig`:
```python
from ns.autoapi.apps import AutoApiConfig


class ShopConfig(AutoApiConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'shop'
```

И добавьте следующий код в ваш корневой `urls.py`:
```python
from ns.autoapi.urls import urlpatterns as autoapi_urlpatterns


urlpatterns = [
    ...  # Какие-то URLs
] + autoapi_urlpatterns
```

Ваше API будет доступно при запуске через обычный runserver:
```shell
python manage.py runserver
```

### Сервисы

Вы можете задать свойство `AutoApiConfig.services_apps` (список строк с названиями django-приложений) ии приложения
чтобы указать, из каких django-приложений вы хотите импортировать сервисы. По умолчанию импортируются только сервисы
текущего приложения. 


### Сущности

Аналогично со свойством `AutoApiConfig.entities_apps`

### Explorer

Для удобства тестирования сгенерированного API NS предоставляет свой аналог Swagger. При запуске приложения собирается
информация об используемых сервисах и сущностях, а затем передается в веб-интерфейс с документацией и возможностью
протестировать API.

Чтобы запустить explorer, введите из консоли:
```shell
python manage.py runapiexplorer <app_name>
```

где `app_name` - название django-приложения, наследника `AutoApiConfig`

### Генерация JavaScript

Для более удобного использования сгенерированного API вы можете сгенерировать javascript-файл с логикой запросов,
код которого будет повторять структуру API.

```shell
python manage.py generateapijs <app_name> <out_file_name>
```

где `app_name` - название django-приложения, наследника `AutoApiConfig`\
    `out_file_name` - путь до итогового файла. например: '../js/shop-service.js'
## **DungeonAI-Translator**

Script para automatizar en tiempo real la traducción en DungeonAI.

- Traducción del historial de la aventura a un idioma en especifico.
- Traducción de entrada del idioma del usuario al ingles para mantener la consistencia.

AIDungeon funciona mejor en inglés.
El objetivo del script es interactuar con la narración en el idioma del usuario, que esta se envíe al juego en Inglés y al mismo tiempo el contenido de la aventura que vaya generando, se traduzca al idioma del usuario.

![](https://play-lh.googleusercontent.com/euTZxOt7w8chhedpujZnAX7F-s5jMACh-ivyf3cCg7nCFwCrnl6HaVG8gOqeu3CgBmJ-)

Las traducciones se efectuan realizando peticiones a un servidor corriendo en python. 

## Instrucciones para su uso:

1.**Iniciar servidor de traducción**
- Instalar dependencias _(execute: pip install -r requirements.txt)_
- Ejecutar el servidor _(execute: python translation_server.py)_

2.**Instalar extensión en Google Chrome**
- Ir a _chrome://extensions/_ o _Menu>Más herramientas>Extensiones_.
- Habilitar el Modo Desarrollador.
- En 'Cargar descomprimida' selecciónar la carpeta 'chrome-extension'.

La extensión funciona dentro de la web de aidungeon y permitirá con un switch habilitar la traducción automática.

**Observaciones**
- Antes de enviar una narrativa por la entrada, luego de que esta se traduzca, asegurarse de presionar una tecla como la de espacio ya que necesita una interacción del teclado, de lo contrario se enviará el texto no traducido.
- Una alternativa a usar la extensión es cargar el script _'chrome-extension/js/translate.js'_ manualmente por el devops o alguna extensión de injección automática.


## Lenguajes soportados (DeepL y Google)
Google es el traductor más rápido y DeepL el más lento, pero más preciso y semantico.

| Abbreviation | Language   | Writing in own language |
|--------------|------------|-------------------------|
| BG           | Bulgarian  | Български               |
| ZH           | Chinese    | 中文                    |
| CS           | Czech      | Česky                   |
| DA           | Danish     | Dansk                   |
| NL           | Dutch      | Nederlands              |
| EN           | English    | English                 |
| ET           | Estonian   | Eesti                   |
| FI           | Finnish    | Suomi                   |
| FR           | French     | Français                |
| DE           | German     | Deutsch                 |
| EL           | Greek      | Ελληνικά                |
| HU           | Hungarian  | Magyar                  |
| IT           | Italian    | Italiano                |
| JA           | Japanese   | 日本語                  |
| LV           | Latvian    | Latviešu                |
| LT           | Lithuanian | Lietuvių                |
| PL           | Polish     | Polski                  |
| PT           | Portuguese | Português               |
| RO           | Romanian   | Română                  |
| RU           | Russian    | Русский                 |
| SK           | Slovak     | Slovenčina              |
| SL           | Slovenian  | Slovenščina             |
| ES           | Spanish    | Español                 |
| SV           | Swedish    | Svenska                 |


**Bugs:**
- Se debe pulsar una tecla antes de enviar la interacción aunque se haya traducido automaticamente.

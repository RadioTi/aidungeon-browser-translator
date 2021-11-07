## **DungeonAI-Translator**

Script para automatizar en tiempo real la traducción en DungeonAI.

- Traducción del historial de la aventura al español
- Traducción de entrada del usuario del español al ingles para mantener la consistencia.

![](https://play-lh.googleusercontent.com/euTZxOt7w8chhedpujZnAX7F-s5jMACh-ivyf3cCg7nCFwCrnl6HaVG8gOqeu3CgBmJ-)

Las traducciones se efectuan realizando peticiones a un servidor corriendo en python. 


**Instrucciones para su uso:**
-      Instalar dependencias *(pip -U deep-translator para modulo de traducción)*
-      Ejecutar el servidor
-      Inyectar js en el navegador
-      Antes de enviar un mensaje asegurarse de presionar 'Shift Right' para traducir la entrada del usuario y cuanto esté lista presionar la tecla espacio ya que necesita un evento del teclado para setearse correctamente, luego ya estaría listo para ser enviado.
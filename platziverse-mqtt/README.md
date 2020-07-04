# Platziverse-mqtt
##  `agent/connected`
``` JS
{
	agent: {
		uuid, // auto generar
		username,// definir por configuración
		name,// definir por configuración
		hostname, // obtener del sistema operativo
		pid// obtener del proceso
	}
}
```
## `agent/disconnected`
``` JS
{
	agent: {
		uuid
	}
}
```
## `agent/message`
``` JS
{
	agent,
	metrics: [
		{
			type,
			value
		}
	],
	timestamp // generar al crear el mensaje
}
```
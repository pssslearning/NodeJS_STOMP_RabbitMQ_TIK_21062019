// ============================================================
// Configuraci�n de acceso STOMP por defecto a RABBITMQ 
// ============================================================
process.env.STOMP_PORT = process.env.STOMP_PORT || 61613;
process.env.STOMP_HOST = process.env.STOMP_HOST || "localhost";
process.env.STOMP_USER = process.env.STOMP_USER || "guest"
process.env.STOMP_PASS = process.env.STOMP_PASS || "guest"
// configuracion global para el puerto

process.env.PORT = process.env.PORT || 3000;

//entorno

process.env.NODE_ENV = process.env.NODE_ENV || "dev";

//DB

let urlDataBase =
  process.env.NODE_ENV === "dev"
    ? "mongodb://localhost:27017/cafe"
    : "mongodb+srv://desarrollo:rj6650560@cafe-pzdji.mongodb.net/cafe?retryWrites=true&w=majority";



process.env.ULRDB = urlDataBase;
const mongoose = require("mongoose");

// Adres URL bazy danych MongoDB
// const { URI_DB: dbURI } = process.env;
const dbURI =
  "mongodb+srv://tomcekala:0vS4ptfWXj1TG3LT@cluster0.gjg16ja.mongodb.net/";

// Utworzenie połączenia
mongoose.connect(dbURI);

// Definicja schematu danych
const Schema = mongoose.Schema;
const mySchema = new Schema({
  name: {
    type: String,
    required: [true, "Set name for contact"],
  },
  email: String,
  phone: String,
  favorite: {
    type: Boolean,
    default: false,
  },
});

// Model danych
const MyModel = mongoose.model("MyModel", mySchema);

// Zdarzenia połączenia
mongoose.connection.on("connected", () => {
  console.log("Połączono z MongoDB");

  // Zapytanie o pobranie danych
  MyModel.find({})
    .then((data) => {
      console.log("Pobrane dane:", data);
    })
    .catch((err) => {
      console.error("Błąd podczas pobierania danych:", err);
    });
});

mongoose.connection.on("error", (err) => {
  console.error("Błąd połączenia z MongoDB:", err);
});

mongoose.connection.on("disconnected", () => {
  console.log("Rozłączono z MongoDB");
});

// Zamykanie połączenia przy zakończeniu aplikacji
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log(
      "Połączenie z MongoDB zostało zakończone z powodu zakończenia aplikacji"
    );
    process.exit(0);
  });
});

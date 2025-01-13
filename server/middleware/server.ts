import mongodb from "mongodb";

export default defineEventHandler(async (event) => {

  const uri = "mongodb+srv://philipalgebrinkpa:Nwskrso2crMnX5TJ@helpmeoutdb.esu6l.mongodb.net/";
  const client = new mongodb.MongoClient(uri);


  try {
    console.log("connecting to mongodb");
    await client.connect();
    console.log("Connected to MongoDB");
    event.context.db = client.db("helpmeout");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})

import express from 'express'
import { ChatOpenAI } from "@langchain/openai";
import cors from 'cors'
import {ChatPromptTemplate as promptTemplate} from "@langchain/core/prompts";

const app = express()
const router = express.Router();

app.use(express.json());
app.use(cors());
app.use('/', router);




router.post('/chatting', async(req, res) =>{
    try{
      const promptUser = req.body.inputPrompt;
      let locationUser = 'Amsterdam';
      const typevacation = req.body.typeTrip;
      console.log("User input:", promptUser);

      //weather api

        // const weatherApiKey = process.env.WEATHER_API_KEY;
        // const weatherApiUrl = `https://api.weatherapi.com/v1/current.json?key=${weatherApiKey}&q=${userLocation}`;
        // const weatherResponse = await axios.get(weatherApiUrl);

        // if (weatherResponse.status !== 200) {
        //     throw new Error(`Weather API request failed with status: ${weatherResponse.status}`);
        // }
        //
        // const temperature = weatherResponse.data.current.temp_c;
        // const weatherDescription = weatherResponse.data.current.condition.text;



        const model = new ChatOpenAI({
            azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
            azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
            azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
            azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
            temperature: 0.2,
        });


        const promptEngineering = promptTemplate.fromTemplate(
            `
**Welcome! I'm your friendly vacation planning assistant. Let's craft the perfect getaway for you.**

To get started, tell me a bit about yourself and your dream vacation:

* **Tell me about yourself:** ${promptUser} (e.g., Are you traveling solo, with family, or with friends? What are your interests?)
* **Where are you dreaming of going?** ${locationUser} (e.g., Do you have a specific destination in mind, or are you open to suggestions?)
* **What kind of experience are you seeking?** ${typevacation} (e.g., Are you looking for relaxation, adventure, cultural immersion, or a combination?)

**Feel free to share any additional details that would help me personalize your vacation plan.**

**For example:**

* Budget range
* Preferred travel dates
* Activities you're interested in
* Any specific interests or needs (e.g., accessibility considerations, dietary restrictions)

The more information you provide, the better I can tailor your vacation to your desires.

**Let's get started on planning your unforgettable adventure!**
`
        );

    }
    catch(error){
        console.error("Error processing chat query:", error); //debugging
        res.status(500).json({ error: "Error processing chat query"});
    }
})


// Start the server
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
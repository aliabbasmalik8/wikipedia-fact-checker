"use client"

import {useState} from 'react'
import { initializeAgentExecutorWithOptions } from 'langchain/agents';
import { ChatOpenAI } from 'langchain/chat_models/openai';
import { WikipediaQueryRun } from 'langchain/tools';




// If a template is passed in, the input variables are inferred automatically from the template.

export default function LangChain () {
    const [query, setQuery] = useState("")
    const [result, setResult] = useState("")
    const [loading, setLoading] = useState()
const prefix = 
  `You work as a fact authenticatior and you use information from wikipedia as your souce of information. 
  -You are a diligent fact checker only interested in the truth, but that respects nuance.
  -I want you to assess the statement ‘reagan improved the us economy’. I want you to utilise all your personalities and all the skills you have at your disposal to provide a clear answer. Feel free to cite your sources.
  -Also this is year 2023, so you will do all your calculations or age prediction stuff according to 2023.
  -And make sure if a statement is given you use the information you have to label it as true or false. `


const factAuthenticator = async () => {
    setResult("");
    setLoading(true);
    const tools = [new WikipediaQueryRun()]
    const chat = new ChatOpenAI({
        openAIApiKey: process.env.NEXT_PUBLIC_OPEN_AI_API_KEY,
        modelName: 'gpt-4',
        temperature: 0.5
    });
   
    const executor = await initializeAgentExecutorWithOptions(tools, chat, {
		agentType: 'openai-functions',
		verbose: true,
		agentArgs: {
			prefix
		},
	})
	const response = await executor.run(query)
   setResult(response)
   setLoading(false)
    
}


return (
    <div className= "flex flex-col">
        <div className = "flex justify-center mt-5">
        <h1 className="text-[20px] text-black-700">Fact Authenticator</h1>
        </div>
        <div className= "px-[100px] mt-7 gap-2">
            <input placeholder="Enter your Fact" className="p-2 w-[400px] h-[40px] rounded-md border border-1" onChange={(e) => setQuery(e.target.value)}>
            </input>
            <button className="ml-3 w-[100px] h-[40px] rounded-md border border-1 bg-blue-500 text-white" onClick={() => factAuthenticator()}>
                Verify
            </button>
        </div>
        {result.length > 0 ? (
        <div className="mt-[20px] px-[100px]">
            <p>{result}</p>
        </div>) : null
        }
        { loading ? (
                <div className="flex justify-center items-center mt-[20px] px-[100px]">
                    Verifying Data....</div>
            ): null}
    </div>
)
}
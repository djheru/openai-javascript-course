import { OpenAI } from "langchain/llms/openai";
import { ChatOpenAI } from "langchain/chat_models/openai";
import { PromptTemplate } from "langchain/prompts";
import { LLMChain } from "langchain/chains";
import { initializeAgentExecutorWithOptions } from "langchain/agents";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";
import { BufferMemory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
import { PlanAndExecuteAgentExecutor } from "langchain/experimental/plan_and_execute";
import { exec } from "child_process";

const { OPENAI_API_KEY, SERPAPI_API_KEY } = process.env;
console.log("OPENAI_API_KEY", OPENAI_API_KEY);
console.log("SERPAPI_API_KEY", SERPAPI_API_KEY);

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
console.log("Welcome to the LangChain Quickstart Module!");

// Format the prompt template
const template = `
You are a social media director with 20 years of experience.
Please give me some ideas for content I should write about regarding {topic}? 
The content is for {socialPlatform}. Translate to {language}.
`;
const inputVariables = ["topic", "socialPlatform", "language"];
const prompt = new PromptTemplate({ template, inputVariables });
const inputParams = {
  topic: "artificial intelligence",
  socialPlatform: "Twitter",
  language: "English",
};
const formattedPromptTemplate = await prompt.format(inputParams);

console.log(formattedPromptTemplate);
// You are a social media director with 20 years of experience.
// Please give me some ideas for content I should write about regarding artificial intelligence?
// The content is for Twitter. Translate to French.

// Initialize the OpenAI API
const llm = new OpenAI({ temperature: 0.9 });

// Create the chain
const chain = new LLMChain({ llm, prompt });

// Execute the chain
const resChain = await chain.call(inputParams);

console.log(resChain);

// Chains vs Agents
// Chain -> pre-defined prompt templates, step by step
// Agent -> dynamically generated prompt template, steps decided by agent

// Initialize the Agent
const agentModel = new OpenAI({
  temperature: 0,
  // https://platform.openai.com/docs/models
  modelName: "text-davinci-003",
}); // temperature 0 means deterministic

// Create agent tools
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Phoenix,Arizona,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
  agentType: "zero-shot-react-description",
  verbose: true,
  maxIterations: 10,
});

// ChatGPT does not know what the answer to this question is, due to knowledge cutoff
// The agent will use the serpapi tool to get the answer
const input = "What is langchain?";

const res = await executor.call({ input });

console.log(res);

/**
 * Plan and action agent
 */

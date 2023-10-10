import { ConversationChain } from "langchain/chains";
import { OpenAI } from "langchain/llms/openai";
import { BufferMemory } from "langchain/memory";
import { SerpAPI } from "langchain/tools";
import { Calculator } from "langchain/tools/calculator";

const { OPENAI_API_KEY, SERPAPI_API_KEY } = process.env;
console.log("OPENAI_API_KEY", OPENAI_API_KEY);
console.log("SERPAPI_API_KEY", SERPAPI_API_KEY);

// to run, go to terminal and enter: cd playground
// then enter: node quickstart.mjs
console.log("Welcome to the LangChain Quickstart Module!");

// Format the prompt template
// const template = `
// You are a social media director with 20 years of experience.
// Please give me some ideas for content I should write about regarding {topic}?
// The content is for {socialPlatform}. Translate to {language}.
// `;
// const inputVariables = ["topic", "socialPlatform", "language"];
// const prompt = new PromptTemplate({ template, inputVariables });
// const inputParams = {
//   topic: "artificial intelligence",
//   socialPlatform: "Twitter",
//   language: "English",
// };
// const formattedPromptTemplate = await prompt.format(inputParams);

// console.log(formattedPromptTemplate);
// // You are a social media director with 20 years of experience.
// // Please give me some ideas for content I should write about regarding artificial intelligence?
// // The content is for Twitter. Translate to French.

// // Initialize the OpenAI API
// const llm = new OpenAI({ temperature: 0.9 });

// // Create the chain
// const chain = new LLMChain({ llm, prompt });

// // Execute the chain
// const resChain = await chain.call(inputParams);

// console.log(resChain);

// // Chains vs Agents
// // Chain -> pre-defined prompt templates, step by step
// // Agent -> dynamically generated prompt template, steps decided by agent

// // Initialize the Agent
// const agentModel = new OpenAI({
//   temperature: 0,
//   // https://platform.openai.com/docs/models
//   modelName: "text-davinci-003",
// }); // temperature 0 means deterministic

// // Create agent tools
const tools = [
  new SerpAPI(process.env.SERPAPI_API_KEY, {
    location: "Phoenix,Arizona,United States",
    hl: "en",
    gl: "us",
  }),
  new Calculator(),
];

// const executor = await initializeAgentExecutorWithOptions(tools, agentModel, {
//   agentType: "zero-shot-react-description",
//   verbose: true,
//   maxIterations: 10,
// });

// // ChatGPT does not know what the answer to this question is, due to knowledge cutoff
// // The agent will use the serpapi tool to get the answer
// const input = "What is langchain?";

// const res = await executor.call({ input });

// console.log(res);

/**
 *
 * Plan and action agent
 *
 * Works with a chat model
 */
// const llm = new ChatOpenAI({
//   temperature: 0,
//   modelName: "gpt-3.5-turbo",
//   verbose: true,
// });

// const executor = PlanAndExecuteAgentExecutor.fromLLMAndTools({
//   llm,
//   tools,
// });

// const result = await executor.call({
//   // We don't tell it how to do it, we just tell it what to do
//   input:
//     "Who is the current president of the United States? What is their age to the 2nd power?",
// });

// console.log(result);

/**
 *
 * Memory
 *
 */
const llm = new OpenAI({
  verbose: true,
});
const memory = new BufferMemory();
const conversationChain = new ConversationChain({ llm, memory });

const input1 = "Hey my favorite athlete is Lebron James";
const res1 = await conversationChain.call({
  input: input1,
});

console.log({ input1, res1 });

const input2 = "Who is my favorite athlete?";
const res2 = await conversationChain.call({
  input: input2,
});

console.log({ input2, res2 });

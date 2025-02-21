# Structured Response Demo

This is a demo app for the following blog posts:

- [Creating App Features Using AI Assistant Structured Output](https://www.anders.co/blog/creating-app-features-using-ai-assistant-structured-output/)
- [AI Assistant Output with End to End Type Safety](https://www.anders.co/blog/ai-asst-output-with-end-to-end-type-safety/)
- [An AI Assistant Development Lifecycle](https://www.anders.co/blog/an-ai-assistant-development-lifecycle/)

[View demo app](https://andersco-structured-output-demo.vercel.app/)

## Running the app locally

1. Clone this repo, run `npm install`
1. Go to [OpenAI](https://openai.com/), create an Assistant (see below).
1. Go to [Upstash](https://upstash.com/), and create a Redis database.
1. Make a copy of the `.env.example` file and rename it to `.env`
1. Add the api keys, assistant Ids, etc listed in the `.env` file.
1. Run `npm run dev` to run the app locally

## Assistants Admin

- Create assistants: `npm run asst:create` - this will create an assistant for each environment and store the respective ids in upstash, using the assistant name as a a key.
- Update assistants: `npm run asst:update` - this will update the "development" assistant based on local config changes.
- "Deploy" assistants: `npm run asst:deploy` - this will update the assistants for all environments, including production.

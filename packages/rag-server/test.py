import modal

resources = [
    {
        "content": 'Anatomy of an AI Agent 👀 | "A Survey on Large Language Model based Autonomous Agents"'
    },
    {
        "content": "How Large Language Models Work",
    },
    {
        "content": "MIT CSAIL Explains: Large Language Models: Part 1",
    },
    {
        "content": "How Neural Networks Learned to Talk | ChatGPT: A 30 Year History",
    },
    {
        "content": "[1hr Talk] Intro to Large Language Models",
    },
    {
        "content": "GPT-3: Language Models are Few-Shot Learners (Paper Explained)",
    },
    {
        "content": "Why Large Language Models Hallucinate",
    },
    {
        "content": "Large Language Models and the Future of AI with Connor Leahy, EleutherAI",
    },
    {
        "content": "What are Large Language Models (LLMs)?",
    },
    {
        "content": "GPT3: An Even Bigger Language Model - Computerphile",
    },
    {
        "content": "Are Large Language Models a Path to AGI? with Ben Goertzel - 625",
    },
    {"content": "LLM agents in science"},
]
f = modal.Function.lookup("rag-server", "RAG.rag")
results = f.remote(
    {"query": "What are Large Language Models?", "docs": resources, "k": 3}
)
print(results)

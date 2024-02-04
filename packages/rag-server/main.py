from typing import List, Optional, TypedDict

import modal
from modal import gpu, build, enter, exit, method


class Document(TypedDict):
    content: str
    metadata: dict


class SearchArgs(TypedDict):
    query: List[str]
    docs: List[Document]
    k: Optional[int]


class SearchResult(TypedDict):
    content: str
    score: float
    rank: int
    result_index: int
    metadata: dict


GPU_CONFIG = gpu.A10G()

my_img = modal.Image.debian_slim().apt_install("git").pip_install("ragatouille")

stub = modal.Stub("rag-server")


@stub.cls(
    gpu=GPU_CONFIG,
    image=my_img,
)
class RAG:
    @build()
    def download_model(self):
        from ragatouille import RAGPretrainedModel

        # This downloads the model weights when not present.
        RAGPretrainedModel.from_pretrained("colbert-ir/colbertv2.0", verbose=0)

    @enter()
    def setup(self):
        from ragatouille import RAGPretrainedModel

        self.model = RAGPretrainedModel.from_pretrained(
            "colbert-ir/colbertv2.0", verbose=0
        )

    @method()
    def rag(self, args: SearchArgs) -> List[List[SearchResult]]:
        metadatas = [doc["metadata"] for doc in args["docs"] if "metadata" in doc]
        doc_contents = [doc["content"] for doc in args["docs"]]
        k = args.get("k", len(doc_contents))
        search_results = self.model.rerank(
            query=args["query"], documents=doc_contents, k=k
        )
        if type(search_results[0]) is not list:
            if len(metadatas) > 0:
                for result in search_results:
                    result["metadata"] = metadatas[result["result_index"]]
            return [search_results]
        else:
            if len(metadatas) > 0:
                for batch in search_results:
                    for result in batch:
                        result["metadata"] = metadatas[result["result_index"]]
            return search_results


@stub.local_entrypoint()
def main():
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
    model = RAG()
    print(
        model.rag.remote(
            {"query": ["large language models"], "docs": resources, "k": 3}
        )
    )

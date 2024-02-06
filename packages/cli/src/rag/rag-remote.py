from typing import List
import modal
from .shared import SearchArgs, SearchResult


def rag(args: SearchArgs) -> List[List[SearchResult]]:
    f = modal.Function.lookup("rag-server", "RAG.rag")
    results = f.remote(
        {
            "query": args["query"],
            "docs": args["docs"],
            "k": args["k"],
        }
    )
    return results

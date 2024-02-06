from typing import List, Optional, TypedDict


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

import asyncio
from typing import Awaitable, Dict, List, Optional
from twscrape import API, gather, AccountsPool, Tweet

api: Optional[API] = None


async def login():
    account_pool = await AccountsPool().load_from_file(
        "accounts.txt", "username:password:email:email_password"
    )
    global api
    api = API(account_pool)
    await api.pool.login_all()
    return api


def hello() -> str:
    return "Hello World!"


async def _get_tweets(user_login: str, n_tweets: int) -> Awaitable[str]:
    global api
    if not api:
        api = await login()
    user = await api.user_by_login(user_login)
    tweets_and_replies = await gather(
        api.user_tweets_and_replies(user.id, limit=n_tweets)
    )  # list[Tweet]
    return "[" + ", ".join([tweet.json() for tweet in tweets_and_replies]) + "]"


def get_tweets(user_login: str, n_tweets=20) -> List[str]:
    return asyncio.run(_get_tweets(user_login, n_tweets))

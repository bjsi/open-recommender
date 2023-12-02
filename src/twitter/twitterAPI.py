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


async def get_or_create_api() -> API:
    global api
    if not api:
        api = await login()
    return api


async def _get_tweet(tweet_id: int) -> Awaitable[str]:
    api = await get_or_create_api()
    tweet = await api.tweet_details(tweet_id)
    if tweet is None:
        return None
    return tweet.json()


async def _get_tweets(user_login: str, n_tweets: int) -> Awaitable[str]:
    api = await get_or_create_api()
    user = await api.user_by_login(user_login)
    tweets_and_replies = await gather(
        api.user_tweets_and_replies(user.id, limit=n_tweets)
    )  # list[Tweet]
    return "[" + ", ".join([tweet.json() for tweet in tweets_and_replies]) + "]"


async def _get_user(user_login: str) -> Awaitable[str]:
    api = await get_or_create_api()
    user = await api.user_by_login(user_login)
    if user is None:
        return None
    return user.json()


# Public API


def get_tweet(tweet_id: int) -> str:
    return asyncio.run(_get_tweet(tweet_id))


def get_user(user_login: str) -> str:
    return asyncio.run(_get_user(user_login))


def get_tweets(user_login: str, n_tweets=20) -> List[str]:
    return asyncio.run(_get_tweets(user_login, n_tweets))


if __name__ == "__main__":
    print(get_tweet(1727204603719238000))

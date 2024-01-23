import asyncio
from distutils.file_util import write_file
import json
from typing import Awaitable, Dict, List, Optional
from twscrape import API, gather, AccountsPool
from contextlib import aclosing

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
        api.user_tweets_and_replies(
            user.id, limit=n_tweets, kv={"includePromotedContent": False}
        )
    )  # list[Tweet]
    return "[" + ", ".join([tweet.json() for tweet in tweets_and_replies]) + "]"


async def _get_user(user_login: str) -> Awaitable[str]:
    api = await get_or_create_api()
    user = await api.user_by_login(user_login)
    if user is None:
        return None
    return user.json()


async def _get_tweets_since(
    user_login: str, since_id: int, n_tweets=100
) -> Awaitable[str]:
    api = await get_or_create_api()
    user = await api.user_by_login(user_login)
    tweets = []
    try:
        async with aclosing(
            api.user_tweets_and_replies(
                user.id, limit=n_tweets, kv={"includePromotedContent": False}
            )
        ) as gen:
            async for t in gen:
                if t.id == since_id:
                    break
                tweets.append(t)
    except Exception as e:
        pass
    return "[" + ", ".join([tweet.json() for tweet in tweets]) + "]"


# Public API


def get_tweet(tweet_id: int) -> str:
    return asyncio.run(_get_tweet(tweet_id))


def get_user(user_login: str) -> str:
    return asyncio.run(_get_user(user_login))


def get_tweets(user_login: str, n_tweets=20) -> List[str]:
    return asyncio.run(_get_tweets(user_login, n_tweets))


def get_tweets_since(user_login: str, since_id: int, n_tweets=100) -> List[str]:
    return asyncio.run(_get_tweets_since(user_login, since_id, n_tweets))


async def main():
    tweets = await _get_tweets_since("experilearning", 1743650001178223048)
    with open("tweets.json", "w") as file:
        file.write(json.dumps(json.loads(tweets)))


if __name__ == "__main__":
    asyncio.run(main())

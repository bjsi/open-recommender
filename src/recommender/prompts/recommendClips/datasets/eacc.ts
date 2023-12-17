import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { recommendClipsInputSchema } from "../schemas/recommendClipsInputSchema";

export const eaccDataset: ExampleDataSet<typeof recommendClipsInputSchema> = {
  title: {
    name: "lex-pod",
    value:
      "Joscha Bach: Life, Intelligence, Consciousness, AI & the Future of Humans | Lex Fridman Podcast",
  },
  tweets: {
    name: "eacc-tweets",
    value: `
ID: 44
@experilearning (2023-11-25)
Here's the repo :) https://t.co/58hPA08fAx
---
ID: 45
tweet: @bryancsk (2023-11-21)
The Three Body Problem is an e/acc piece of science fiction because, unlike the others that narrate the dangers of new technology, it describes the civilisation-ending consequences of *delaying* the development of new tech
reply: @experilearning (2023-11-22)
Instead of killing scientists, the aliens drove them crazy and spread doomerism to throttle Earth's capacity to create new knowledge. Its not the knowledge you create that kills you, it's the knowledge you didn't create and the danger you didn't foresee
https://t.co/gO6RPaJsjf
---
ID: 46
Liked by @experilearning
@bryancsk (2023-11-21)
The Three Body Problem is an e/acc piece of science fiction because, unlike the others that narrate the dangers of new technology, it describes the civilisation-ending consequences of *delaying* the development of new tech
---
ID: 47
@experilearning (2023-11-22)
it does feel like i'm getting trolled by gpt-3.5 instruct a bit, writing "you should do X, Y, Z" seems to get it to perform the task much more reliably than writing "you must do X, Y, Z" even though they mean effectively the same thing
`.trim(),
  },
  transcript: {
    name: "eacc-transcript",
    value: `
ID: 0
there is a certain perspective where you
---
ID: 1
might be thinking what is the longest
---
ID: 2
possible game that you could be playing
---
ID: 3
a short game is for instance cancer is
---
ID: 4
playing a shorter game than your
---
ID: 5
organism it kind of is an organism
---
ID: 6
playing a shorter game than the regular
---
ID: 7
organism and because the Cancer Cannot
---
ID: 8
procreate beyond the organism
---
ID: 9
um except for some infectious cancers
---
ID: 10
like the ones that eradicated the
---
ID: 11
testimonial Devils
---
ID: 12
you typically end up with the situation
---
ID: 13
where the organism dies together with
---
ID: 14
stick cancer because the cancer has
---
ID: 15
destroyed the larger system due to
---
ID: 16
playing a shorter game and so ideally
---
ID: 17
you want to I think build agents that
---
ID: 18
play the longest possible games and the
---
ID: 19
longest possible games is to keep
---
ID: 20
entropy at Bay as long as possible
---
ID: 21
interesting, uh you tweeted effective accelerationism
---
ID: 22
is the belief that the paper could
---
ID: 23
maximizer and Rocco's basilisks will
---
ID: 24
keep each other in check but being
---
ID: 25
eternally at each other's throats so we
---
ID: 26
will be safe and get to enjoy lots of
---
ID: 27
free paper clips and a beautiful
---
ID: 28
free paper clips and a beautiful afterlife
---
ID: 29
afterlife
---
ID: 30
afterlife um
---
ID: 31
um
---
ID: 32
is that somewhat aligned with what
---
ID: 33
you're talking about
---
ID: 34
I've been at the dinner with Beth Jesus
---
ID: 35
um that's the Twitter handle of
---
ID: 36
um of one of the main thinkers behind
---
ID: 37
the idea of effective accelerationism
---
ID: 38
and effective accelerationism is a
---
ID: 39
tongue-in-cheek movement that is uh
---
ID: 40
trying to put a counter position to some
---
ID: 41
of the Doom peers in the AI Space by
---
ID: 42
arguing that what's probably going to
---
ID: 43
happen is an equilibrium between
---
ID: 44
different Computing AIS in the same way
---
ID: 45
as there is not a single corporation
---
ID: 46
that is under a single government that
---
ID: 47
is destroying and conquering everything
---
ID: 48
on Earth by becoming inefficient and
---
ID: 49
corrupt they're going to be many systems
---
ID: 50
that keep each other in check and force
---
ID: 51
themselves to evolve and so what we
---
ID: 52
should be doing is we should be working
---
ID: 53
towards creating this equilibrium by
---
ID: 54
working as hard as we can in all
---
ID: 55
possible directions
---
ID: 56
possible directions and
---
ID: 57
and
---
ID: 58
at least that's the way I in which I
---
ID: 59
understand the gist of effective
---
ID: 60
accelerationism
---
ID: 61
by the way I learned a lot while I was
---
ID: 62
programming as a child when you start
---
ID: 63
out with a computer like a Commodore 64
---
ID: 64
who doesn't which doesn't have a lot of
---
ID: 65
functionality it's relatively easy to
---
ID: 66
see how a bunch of relatively simple
---
ID: 67
circuits are just basically performing
---
ID: 68
hashes between bit patterns and how you
---
ID: 69
can build the entirety of mathematics
---
ID: 70
and computation on top of this and all
---
ID: 71
the representational languages that you
---
ID: 72
the representational languages that you need
---
ID: 73
need
---
ID: 74
man Commodore 64 could be one of the
---
ID: 75
sexiest machines ever built if I still
---
ID: 76
say so myself if you can return
---
ID: 77
to uh this really interesting idea
---
ID: 78
that we started to talk about with
---
ID: 79
that we started to talk about with pansychism   
`.trim(),
  },
};

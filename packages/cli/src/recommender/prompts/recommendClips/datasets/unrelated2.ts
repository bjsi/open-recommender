import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { recommendClipsInputSchema } from "../schemas/recommendClipsInputSchema";

/**
 * Sanity check to make sure the prompt doesn't always recommend clips.
 * This example takes my tweets about recommendation systems and compares them to a podcast about plants.
 */
export const unrelatedDataset2: ExampleDataSet<
  typeof recommendClipsInputSchema
> = {
  title: {
    name: "plants-pod",
    value: "Episode 144: Plant This with That-Fall Edition",
  },
  tweets: {
    name: "rec-sys-tweets",
    value: `
ID: 34
@experilearning (2023-12-04)
@ErikBjare data pipeline is looking clean ✨ it takes a while to run and can be tough to debug so I added a pipeline abstraction to save the inputs, outputs and errors of each stage allowing me to restart a run from a particular stage https://t.co/CbbIQV9RTK
---
ID: 35
Liked by @experilearning
@ritvvijparrikh (2023-12-05)
@experilearning Write about it? Would love to read more on this.. and even chime in if I can :)
---
ID: 36
tweet: @experilearning (2023-12-05)
Just published an article about Open Recommender (aka the recommendation system for the terminally online)
Open Recommender is an open source, LLM-powered recommendation system that takes your Twitter as input and gives you YouTube video recommendations
https://t.co/BdJ3KfKikv
reply: @experilearning (2023-12-06)
@ritvvijparrikh just published the first article :) https://t.co/689x0xUG5w
`.trim(),
  },
  transcript: {
    name: "plants-pod",
    value: `
ID: 2
hello and welcome to another episode of
---
ID: 3
let's argue about plants the podcast for
---
ID: 4
people who love plants but not always
---
ID: 5
the same ones I'm Carol Collins I'm
---
ID: 6
associate editor at fine gardening
---
ID: 7
magazine and I'm Danielle Shar I'm the
---
ID: 8
executive editor hey Carol Happy
---
ID: 9
official fall how you doing I am much
---
ID: 10
cooler now that the fall weather is
---
ID: 11
setting in right we had like a a fall
---
ID: 12
start to fall I think here in New
---
ID: 13
England this year folks it was uh 90
---
ID: 14
degrees uh we actually did hit 90 there
---
ID: 15
were some record-breaking temperatures
---
ID: 16
it was humid as Florida and yeah it made
---
ID: 17
me really truly appreciate this morning
---
ID: 18
waking up to the first fall weather that
---
ID: 19
we've really had like a nice cool 60 and
---
ID: 20
dry this is why we live here this is why
---
ID: 21
we live here but with that being said we
---
ID: 22
decided to we've delved into fall a
---
ID: 23
little bit so far this season but Carol
---
ID: 24
what's our topic today we're GNA talk
---
ID: 25
about plant this with that fall Edition
---
ID: 26
so what you know combos of plants that
---
ID: 27
look great together at the end of the
---
ID: 28
season like now yes y love it I love it
---
ID: 29
I love it um truth be told how I got par
---
ID: 30
for this is I walked around my garden
---
ID: 31
I'm like oh you look good with you all
---
ID: 32
right let's take a picture and I'm gonna
---
ID: 33
talk about that one so I will say
---
ID: 34
disclosure these aren't like you know
---
ID: 35
the most groundbreaking combinations but
---
ID: 36
it's what was like truly inspiring me in
---
ID: 37
my garden right now yes and I must admit
---
ID: 38
that my I switched it up a little maybe
---
ID: 39
since the last time you saw the lineup
---
ID: 40
but I was inspired by one of your
---
ID: 41
combinations so we'll we'll get to that
---
ID: 42
later in the show but yes I I I also did
---
ID: 43
a walkabout for inspiration same thing I
---
ID: 44
I had a feeling because if you're
---
ID: 45
watching this on YouTube which you can
---
ID: 46
watch this podcast as opposed to listen
---
ID: 47
only to this podcast on YouTube if you
---
ID: 48
go to the Fine gardening YouTube channel
---
ID: 49
you can see Carol and I in all of our
---
ID: 50
early morning recording Glory but Carol
---
ID: 51
always has generally a vase behind her
---
ID: 52
in her office where the plants that are
---
ID: 53
in the vase often times are a preview of
---
ID: 54
what Carol is going to talk about and I
---
ID: 55
spy with my little eye a plant back
---
ID: 56
there that I know I'm gonna talk about
---
ID: 57
so I have a feeling I know how you mixed
---
ID: 58
it up that is it we usually try to avoid
---
ID: 59
talking about the same plants but I
---
ID: 60
thought this might be fun to you know
---
ID: 61
combos that play off a different a plant
---
ID: 62
with a different take on the same
---
ID: 63
absolutely absolutely well I won't force
---
ID: 64
your hand to talk about that particular
---
ID: 65
plant but what is your first combo plant
---
ID: 66
this with that the fall Edition so this
---
ID: 67
one is a kind of a classic Cottage
---
ID: 68
Garden combo what I have is white drift
---
ID: 69
Rose that's Rosa
---
ID: 70
myerland um with tall Garden flocks and
---
ID: 71
that's flocks
---
ID: 72
panicula I do not know the cultivar of
---
ID: 73
my flocks I do not I the the it's a
---
ID: 74
mystery the tag is lost to the sands of
---
ID: 75
time but um tall Garden flocks is Hardy
---
ID: 76
from zones 4 to eight the white drift
---
ID: 77
row zones 4 to 11 so this a super cold
---
ID: 78
hearty combo the white drift Rose is
---
ID: 79
considered a landscape Rose and or a
---
ID: 80
ground cover Rose and so it grows like 2
---
ID: 81
feet tall 3 feet wide uh like SP Sun
---
ID: 82
Rich well- drained soil you know it's
---
ID: 83
you know it's a rose but it's pretty
---
ID: 84
trouble-free it it stays disease-free
---
ID: 85
throughout the summer and unlike some of
---
ID: 86
the other roses that maybe you know your
---
ID: 87
grandparents had or your mom had this
---
ID: 88
one will rebloom throughout the season
---
ID: 89
so you will get that early summer flush
---
ID: 90
of beautiful little tiny miniature white
---
ID: 91
roses but it will rebloom throughout the
---
ID: 92
summer um so it's just it's a nice solid
---
ID: 93
base for many combos throughout the
---
ID: 94
season but as you get toward fall I have
---
ID: 95
this blocks that's been you know at
---
ID: 96
first it's they started out side by side
---
ID: 97
now it's kind of growing up through the
---
ID: 98
rose and it gets taller than the rose
---
ID: 99
which only hits about you know three
---
ID: 100
feet at the most and so you have these
---
ID: 101
you know these this cloud of flock
---
ID: 102
flowers sort of floating above the white
---
ID: 103
roses and I I love it and it's a little
---
ID: 104
bit um fruy for me but but I'm okay with
---
ID: 105
that um and I would say you you know the
---
ID: 106
the flocks that I have it's very pretty
---
ID: 107
it's got you know sort of a pink petal
---
ID: 108
with a darker pink eye and what I
---
ID: 109
noticed this year we had a very hot
---
ID: 110
humid summer and especially toward the
---
ID: 111
end not a speck of mildew on it and
---
ID: 112
that's not always the cas yeah so that's
---
ID: 113
and and then again you know the white
---
ID: 114
drift roads also quite disease free so I
---
ID: 115
think that's an important part of this
---
ID: 116
combination but um when I was traveling
---
ID: 117
this summer I got to see some awesome
---
ID: 118
fles uh from the garden girl series and
---
ID: 119
those tall fles are upright mildo
---
ID: 120
resistant reblooming so you're going to
---
ID: 121
you know they bloom maybe even longer
---
ID: 122
into the fall than mine does and um so
---
ID: 123
what I'm going to do is I'm going to
---
ID: 124
drop photos into the in my combo will be
---
ID: 125
in the show notes but also I'm going to
---
ID: 126
drop in a picture of flocks with Uptown
---
ID: 127
Girl and Glamour Girl up uptown Uptown
---
ID: 128
girl has is light pink with a darker
---
ID: 129
pink eye Glamour Girl is coral pink um
---
ID: 130
and it has dark purple stems just
---
ID: 131
gorgeous really you know the the garden
---
ID: 132
girl series
---
ID: 133
are selected for you know they're
---
ID: 134
they're quite different from each other
---
ID: 135
but they're all you know have that
---
ID: 136
disease fre re Blooming Thing so um
---
ID: 137
straight species of garden flocks it's
---
ID: 138
native to the eastern US pollinators
---
ID: 139
loveed it and I just I love the smell of
---
ID: 140
flocks in the fall it reminds me of
---
ID: 141
gathering apples from like abandoned
---
ID: 142
homesteads with my parents because you
---
ID: 143
know when I was a kid we we would know
---
ID: 144
where the good apple trees were and
---
ID: 145
flocks was often nearby these are the
---
ID: 146
two things that people planted long ago
---
ID: 147
and they just kept going so oh so it's a
---
ID: 148
trigger a trigger fragrance for you yeah
---
ID: 149
it's nice fall memories go with the
---
ID: 150
smell of flocks for me so that's yeah
---
ID: 151
that's just an added bonus that's
---
ID: 152
amazing all right so so the Uptown Girl
---
ID: 153
series of flocks not necessarily the
---
ID: 154
flocks that you have but a very close
---
ID: 155
dupe and a good suggestion because of
---
ID: 156
them being so disease resistant and then
---
ID: 157
say what the drift Rose was again so
---
ID: 158
it's the sort of the brand name for it
---
ID: 159
if you will it's white drift Rose and
---
ID: 160
that's what what you'll see it sold as
---
ID: 161
but its botanical name is Rosa Miser
---
ID: 162
land me i z o r l n d so uh you know if
---
ID: 163
you if you look it up you'll Pro you may
---
ID: 164
be seeing it like that but I think most
---
ID: 165
people are selling it as white drift
---
ID: 166
Carol this was like this was mindblowing
---
ID: 167
as far as your first combo because a I
---
ID: 168
think of roses and flocks as both being
---
ID: 169
summer not
---
ID: 170
fall B I always think of them being
---
ID: 171
super problematic plants because of them
---
ID: 172
being you know so susceptible to
---
ID: 173
especially you know the the humidity
---
ID: 174
diseases black spot brown spot rust
---
ID: 175
powdery mildew so the fact that you know
---
ID: 176
both of these look good after the humid
---
ID: 177
weather and look so good that they were
---
ID: 178
a dynamic combo enough for you to talk
---
ID: 179
about I mean I think both of that like
---
ID: 180
that you know recommendation is so
---
ID: 181
awesome because it's very unexpected I
---
ID: 182
mean the second you said Rosen FL I was
---
ID: 183
like all right this is going to be good
---
ID: 184
let's see where this
---
ID: 185
goes yeah it sounded like it was going
---
ID: 186
to be a dis disease Fest right but right
---
ID: 187
I'm like like wait what what's the great
---
ID: 188
pairing here black spot with mildew like
---
ID: 189
what's going on but okay that is very
---
ID: 190
cool I'm going to have to write down the
---
ID: 191
names of both of those because I think
---
ID: 192
my garden might need those all right
---
ID: 193
Carol so I'm going for it I think I'm
---
ID: 194
going to talk about the pairing that
---
ID: 195
makes me the happiest right now and I
---
ID: 196
think that we're going to have one plant
---
ID: 197
in common from this pairing but I was
---
ID: 198
walking around and I saw my limelight
---
ID: 199
panicle hydrangea which is a hydrange
---
ID: 200
paniculata Limelight zones 3
---
ID: 201
to9 just dancing in unison Like Dancing
---
ID: 202
with the Stars and they were like the
---
ID: 203
number one like couple my son King
---
ID: 204
Aurelia which is Aurelia cordada Sun
---
ID: 205
King and that zones three to nine and
---
ID: 206
man they just look awesome together
---
ID: 207
right now I mean end of September
---
ID: 208
beginning of October the Limelight
---
ID: 209
panicle hydram ninja which you know is a
---
ID: 210
sizable entry into this pairing it's
---
ID: 211
mine is probably topping out over six
---
ID: 212
feet tall at this point and it's got
---
ID: 213
humongous panicles on it these you know
---
ID: 214
the size of my head which you know for
---
ID: 215
those who aren't watching the YouTube
---
ID: 216
channel I guess it's about the size of a
---
ID: 217
baseball mitt it is a huge flower head
---
ID: 218
and they start out chartreuse when they
---
ID: 219
start blooming in you know early to
---
ID: 220
Midsummer but these panicles of flowers
---
ID: 221
have now shifted and they've got kind of
---
ID: 222
a Rosy blush to them so you've got a a
---
ID: 223
hue of chartreuse a hue of creamy white
---
ID: 224
and a hue of of just this beautiful
---
ID: 225
blush color and they're kind of you know
---
ID: 226
hanging out on the top of the of the
---
ID: 227
shrub at this point in time and then my
---
ID: 228
Sun King aelia which is planted next to
---
ID: 229
it has now sized up similarly it's about
---
ID: 230
four and a half feet tall I know that
---
ID: 231
they say everywhere 3 by3 for a Sun King
---
ID: 232
aelia that is crap that is not accurate
---
ID: 233
they don't know what they're talking
---
ID: 234
about my son King aelia is about the
---
ID: 235
same size as me and I'm 5 foot three so
---
ID: 236
it's a big beefer and they're just kind
---
ID: 237
of growing in unison and at that point
---
ID: 238
where they're touching each other is
---
ID: 239
beautiful the Aurelia at this point in
---
ID: 240
time has just a really beautiful golden
---
ID: 241
hue to it
`.trim(),
  },
};

import { ExampleDataSet } from "prompt-iteration-assistant/dist/lib/prompt";
import { recommendClipsInputSchema } from "../schemas/recommendClipsInputSchema";

export const unrelatedDataset1: ExampleDataSet<
  typeof recommendClipsInputSchema
> = {
  title: {
    name: "lex-bezos",
    value: "Jeff Bezos: Amazon and Blue Origin | Lex Fridman Podcast",
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
    name: "bezos-transcript",
    value: `
ID: 1827
us but you know I spoke to Elon a few
---
ID: 1828
times recently about you about blue
---
ID: 1829
origin and he was very positive about
---
ID: 1830
you as a person and very supportive of
---
ID: 1831
all the efforts you've been leading at
---
ID: 1832
Blue what's your thoughts you worked
---
ID: 1833
with a lot of leaders at Amazon at Blue
---
ID: 1834
what's your thoughts about Elon as a
---
ID: 1835
human being and a
---
ID: 1836
leader well I don't really know Elon
---
ID: 1837
very well um you know I know his public
---
ID: 1838
persona but I also know you can't know
---
ID: 1839
anyone by their public Persona um it's
---
ID: 1840
impossible I mean you may think you do
---
ID: 1841
but I guarantee you don't so I don't
---
ID: 1842
really know you know Elon way better
---
ID: 1843
than I do Lex but um in in terms of his
---
ID: 1844
judging by the results he must be a very
---
ID: 1845
capable leader um there's no way you
---
ID: 1846
could have you know Tesla and SpaceX
---
ID: 1847
without being a capable leader it's
---
ID: 1848
impossible yeah I just I I hope you guys
---
ID: 1849
hang out sometimes shake hands and and
---
ID: 1850
sort of um have a kind of friendship
---
ID: 1851
that would Inspire just the entirety of
---
ID: 1852
humanity because you what you're doing
---
ID: 1853
is like one of the big
---
ID: 1854
Grand challenges ahead for Humanity well
---
ID: 1855
I agree with you and I think in a lot of
---
ID: 1856
these um Endeavors we're very
---
ID: 1857
like-minded yeah so I think you I think
---
ID: 1858
you I'm not saying we're identical but I
---
ID: 1859
think we're very likeminded and so I you
---
ID: 1860
know know I I I love that idea all right
---
ID: 1861
going back to uh sexy pictures on your
---
ID: 1862
Instagram uh there's a video of you from
---
ID: 1863
the early days of Amazon um giving a
---
ID: 1864
tour of your quote sort of offices I
---
ID: 1865
think your dad is holding the camera he
---
ID: 1866
is yeah I know yes this is what the
---
ID: 1867
Giant Orange extension cord and yeah and
---
ID: 1868
you're like explaining the The Genius of
---
ID: 1869
the extension cord how this a this a
---
ID: 1870
desk and the CRT Monitor and sort of
---
ID: 1871
that's where the that's where all the
---
ID: 1872
magic Captain I forget what your dad
---
ID: 1873
said but this is like the the the center
---
ID: 1874
of it all so um what was it like what
---
ID: 1875
was going through your mind at that time
---
ID: 1876
you left a good job in New York and took
---
ID: 1877
this leap were you excited were you
---
ID: 1878
scared so excited and scared anxious you
---
ID: 1879
know thought the odds of success were
---
ID: 1880
low told all of our early investors that
---
ID: 1881
I thought there was a 30% chance of
---
ID: 1882
success by which I just been getting
---
ID: 1883
your money back not like turn not what
---
ID: 1884
actually happened happened because
---
ID: 1885
that's the truth every startup company
---
ID: 1886
is unlikely to work it's helpful to be
---
ID: 1887
in reality about that um but that
---
ID: 1888
doesn't mean you can't be optimistic so
---
ID: 1889
you kind of have to have this duality in
---
ID: 1890
your head like you on the one hand
---
ID: 1891
you're you know what the Baseline
---
ID: 1892
statistics say about startup companies
---
ID: 1893
and the other hand you have to ignore
---
ID: 1894
all of that and just be 100% sure it's
---
ID: 1895
going to work and you're doing both
---
ID: 1896
things at the same time you're holding
---
ID: 1897
that contra Addiction in your head but
---
ID: 1898
it was so so exciting I love you know
---
ID: 1899
every from 1994 when uh the company was
---
ID: 1900
founded 1995 when we opened our
---
ID: 1901
doors all the way until today it's I
---
ID: 1902
find Amazon so exciting and that doesn't
---
ID: 1903
mean it's like full of pain full of
---
ID: 1904
problems you know it's like there so
---
ID: 1905
many things that need to be resolved and
---
ID: 1906
worked and made better and and Etc but
---
ID: 1907
but on balance it's so fun it's such a
---
ID: 1908
privilege it's been such a joy I feel so
---
ID: 1909
grateful that I've been part of that
---
ID: 1910
Journey um it's just been incredible so
---
ID: 1911
in some sense you don't want a a single
---
ID: 1912
day of comfort you've written about this
---
ID: 1913
many times we'll talk about your writing
---
ID: 1914
which uh I I would highly recommend
---
ID: 1915
people read in just the letters to
---
ID: 1916
shareholders uh so you wrote up uh
---
ID: 1917
explaining the idea of day one thinking
---
ID: 1918
I think you first wrote bought in 97
---
ID: 1919
letters to shareholders then you also in
---
ID: 1920
a way wrote it
---
ID: 1921
about sad to say is your last letter to
---
ID: 1922
shareholders Co um and you said that day
---
ID: 1923
two is stasis followed by
---
ID: 1924
irrelevance followed by excruciating
---
ID: 1925
painful decline followed by death and
---
ID: 1926
that is why it's always day
---
ID: 1927
one um can you explain this day one
---
ID: 1928
thing this is a really powerful way to
---
ID: 1929
describe the beginning and the journey
---
ID: 1930
of Amazon it's it's really a very simple
---
ID: 1931
and I think age-old idea about renewal
---
ID: 1932
and rebirth and like every day is day
---
ID: 1933
one every day you're deciding what
---
ID: 1934
you're going to do and you are not
---
ID: 1935
trapped by what you were or who you were
---
ID: 1936
or any self-consistency self-consistency
---
ID: 1937
even can be trap and so day one thinking
---
ID: 1938
is kind of we start fresh every day and
---
ID: 1939
we get to make new decisions every day
---
ID: 1940
about invention about customers about uh
---
ID: 1941
how we're going to operate what even
---
ID: 1942
even even as deeply as what our
---
ID: 1943
principles are we can go back to that
---
ID: 1944
turns out we don't change those very
---
ID: 1945
often but we change them
---
ID: 1946
occasionally and um when we work on
---
ID: 1947
programs that
---
ID: 1948
Amazon we often uh make a list of
---
ID: 1949
tenants and this the tenants are kind of
---
ID: 1950
they're not principles they're a little
---
ID: 1951
more tactical than principles but it's
---
ID: 1952
kind of the the main ideas that we want
---
ID: 1953
this program to embody whatever those
---
ID: 1954
are and one of the things that we do is
---
ID: 1955
we put these are the tenants for this
---
ID: 1956
program and in parentheses we always put
---
ID: 1957
unless you know a better
---
ID: 1958
way and that idea unless you know a
---
ID: 1959
better way is so important because you
---
ID: 1960
never want to get trapped by Dogma you
---
ID: 1961
never want to get trapped by history it
---
ID: 1962
doesn't mean you discard history or
---
ID: 1963
ignore it there's so much value in what
---
ID: 1964
has worked in the past and but you can't
---
ID: 1965
be blindly following what you've done
---
ID: 1966
and that's the heart of day one is
---
ID: 1967
you're always starting fresh and uh to
---
ID: 1968
the question of of how to fend off day
---
ID: 1969
two you said such a question can't have
---
ID: 1970
a simple answer as you're saying there
---
ID: 1971
will be many elements multiple paths and
---
ID: 1972
many traps I don't know the whole answer
---
ID: 1973
but I may know bits of it here's a
---
ID: 1974
starter pack of Essentials maybe others
---
ID: 1975
come to mind for day one
---
ID: 1976
defense customer Obsession uh a
---
ID: 1977
skeptical view of proxies the eager
---
ID: 1978
adoption of external trends and high
---
ID: 1979
velocity decision making so we talked
---
ID: 1980
about High Velocity decision making
---
ID: 1981
that's more difficult than it
---
ID: 1982
sounds so maybe you can pick one that
---
ID: 1983
stands out to you as you can comment on
---
ID: 1984
uh eager adoption of external trends
---
ID: 1985
High Velocity decision-making skeptical
---
ID: 1986
view of proxies how do you fight off day
---
ID: 1987
two well you know I'll talk about
---
ID: 1988
because I think it's the one that is
---
ID: 1989
maybe in some ways the hardest to
---
ID: 1990
understand um is the skeptical view of
---
ID: 1991
proxies um one of the things that
---
ID: 1992
happens in business probably anything
---
ID: 1993
that you're where you're you know you
---
ID: 1994
have an ongoing program and something is
---
ID: 1995
is underway for a number of years is you
---
ID: 1996
develop certain things that you're
---
ID: 1997
managing to like let's say the typical
---
ID: 1998
case would be a
---
ID: 1999
metric and that metric isn't the real
---
ID: 2000
metric and that metric isn't the real underlying
---
ID: 2001
underlying
---
ID: 2002
thing and so uh you know maybe the
---
ID: 2003
metric is um efficiency metric around
---
ID: 2004
customer contacts per unit sold or
---
ID: 2005
something like if you sell a million
---
ID: 2006
units how many customer contacts do you
---
ID: 2007
get or how many returns do you get and
---
ID: 2008
so on and so on and so what happens is a
---
ID: 2009
little bit of a kind of inertia sets
---
ID: 2010
in where somebody a long time ago
---
ID: 2011
invented that metric and they invented
---
ID: 2012
that metric they decided we need to
---
ID: 2013
watch for you know customer returns per
---
ID: 2014
unit sold as an important metric but
---
ID: 2015
they had a reason why they chose that
---
ID: 2016
that metric the person who invented that
---
ID: 2017
metric and decided it was worth watching
---
ID: 2018
and then fast forward five years that
---
ID: 2019
metric is the proxy MH the proxy for
---
ID: 2020
truth I guess the proxy for truth the
---
ID: 2021
proxy for customer let's say in this
---
ID: 2022
case it's a proxy for customer
---
ID: 2023
happiness and but that metric is not
---
ID: 2024
actually customer happiness it's a proxy
---
ID: 2025
for customer happiness the person who
---
ID: 2026
invented the metric understood that
---
ID: 2027
connection five years later
---
ID: 2028
it a kind of inertia can set in and you
---
ID: 2029
forget the truth behind why you were
---
ID: 2030
watching that metric in the first place
---
ID: 2031
and the world shifts a little yeah and
---
ID: 2032
now that proxy isn't as valuable as it
---
ID: 2033
used to be or it's missing something and
---
ID: 2034
you have to be on alert for that you
---
ID: 2035
have to know okay this is I don't really
---
ID: 2036
care about this metric I care about
---
ID: 2037
care about this metric I care about customer
---
ID: 2038
customer
---
ID: 2039
happiness and this metric is worth
---
ID: 2040
putting energy into and following and
---
ID: 2041
improving and scrutinizing only in so
---
ID: 2042
much as it actually affects customer
---
ID: 2043
happiness and so you got to constantly
---
ID: 2044
be on guard and it's very very common
---
ID: 2045
this is a nuanced problem it's very
---
ID: 2046
common especially in large companies
---
ID: 2047
that they are managing to metrics that
---
ID: 2048
they don't really understand they don't
---
ID: 2049
really know why they exist and the world
---
ID: 2050
may have shifted out from under them a
---
ID: 2051
little and the metrics are no longer as
---
ID: 2052
relevant as they were when somebody 10
---
ID: 2053
years earlier invented the metric that
---
ID: 2054
is a Nuance but uh that's a big problem
---
ID: 2055
right there's something so compelling to
---
ID: 2056
have a nice metric to try to optimize
---
ID: 2057
yes and by the way you do need metrics
---
ID: 2058
yes you do you know you can't ignore
---
ID: 2059
them um you want them but you just have
---
ID: 2060
to be constantly on guard this is you
---
ID: 2061
know a a way to slip into day two
---
ID: 2062
thinking would be to manage your
---
ID: 2063
business to metrics that you don't
---
ID: 2064
really understand and you're not really
---
ID: 2065
sure why they were invented in the first
---
ID: 2066
place and you're not sure they're still
---
ID: 2067
as relevant as they used to be uh what
---
ID: 2068
does it take to be the guy or gal who
---
ID: 2069
who uh who brings up the point that this
---
ID: 2070
proxy might be outdated I guess what
---
ID: 2071
does it take to have a culture that
---
ID: 2072
enables that in the meeting because
---
ID: 2073
that's a very uncomfortable thing to
---
ID: 2074
bring up at a meeting we all showed up
---
ID: 2075
here Friday this is such you have just
---
ID: 2076
asked a million-dollar question so th
---
ID: 2077
this is this is what you're if I
---
ID: 2078
generalize what you're asking you were
`.trim(),
  },
};

# This is a markdown parser built from scratch in JS 

[Github repo](https://github.com/sarvasvkulpati/markdown) [Tweet thread](https://twitter.com/SarvasvKulpati/status/1365630258276306947)

## Why I built this

I really wanted to understand the basics of compilers, but with all these terms like tokenizers and lexers and parsers and recursive descent and LL(1), I got really intimidated and never looked into it too much.

But the concept of a compiler is *fascinating*. You input some text, and using some simple logic, you can convert it into something ** completely different **. 

At the same time, I was thinking a lot about [owning my stack](https://twitter.com/SarvasvKulpati/status/1360446910834692101). We have nearly ubiquitous personal computing, and yet, the moment we need a problem solved, we look to buying software- using 'free' software that just sells our data instead, or using pre-built libraries to do the job for us.

So, bringing these two together, I decided to learn about compilers by directly building something I could use. 

## How it works

**The code has two helpers:**
- a Reader class, that consumes tokens one by one
- a LineReader class, that splits input into lines and reads them one by one 

**And 3 main parts:**
- a tokenizer function, that converts raw markdown into a list of tokens
- a Parser class, built up of several functions that each mutually recurse to return a single dom node
- a function that traverses the json dom object returned from the parser and returns an html string


## Features

# H1
## H2
### h3
#### h4

Paragraphs with *italics*, **bold** and ** *nested* emphasis *

[links](https://www.youtube.com/watch?v=xvFZjo5PgG0)

![image](https://cdn.pixabay.com/photo/2019/11/08/11/56/cat-4611189__340.jpg) 

> blockquotes

- unordered
- lists
- (nested lists have a bug)

<table>
<tr>
<th>Inline</th>
<th>html</th>
</tr>
<tr>
<td>placeholder</td>
<td>text</td>
</tr>
</table>


\\# <- escaping characters
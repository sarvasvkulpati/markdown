/*

h1-6

*/


// let input = `


/*
# this is a header
this is a *paragraph* of text
this is another **paragraph** of text
![this is an image](https://via.placeholder.com/150) and some text after the image
this is [   google    ](https://www.google.com)
## this is an h2
### this is an h3
# another header
<b>inline html</b>
more paragraphs
> to be or not to be a pencil - Gandhi
- here's a point I'd like to make
- and another one
- aaaand another one
  - this is an indented point
  
  */


// `


let input = `

# this is a header
this is a *paragraph* of text
this is another **paragraph** of text
![this is an image](https://via.placeholder.com/150) and some text after the image
this is [   google    ](https://www.google.com)
## this is an h2
### this is an h3
# another header
<b>inline html</b>
more paragraphs
> to be or not to be a pencil - Gandhi
- here's a point I'd like to make
- and *another* one
- aaaand **another** one
  - this is an indented point

`





// reader class that returns the chars in individual lines
class Reader {
  constructor(line) {
    this.line = line
    this.idx = 0
  }

  //needs to be 0 because next() returns an value, and then increments the index. this.idx + 1 would be 1 more than the incremented index, which is 2 ahead of the current char
  peek(k = 0) {
    return this.line[this.idx + k]
  }

  next() {


    return this.line[this.idx++]

  }

  hasNext() {
    return this.idx < this.line.length
  }


  readUntil(token){

  }

  isFirst() {

    return this.idx == 1
  }

}


// reader class that returns the lines in the input content
class LineReader {

  constructor(lines) {
    this.lines = lines
    this.idx = 0
  }

  prev() {
    if (idx > 0) {
      return this.lines[this.idx - 1]
    }
  }

  peek(k = 0) {

    return this.lines[this.idx + k]
  }

  next() {



    return this.lines[this.idx++]



  }

  hasNext() {
    return this.idx < this.lines.length
  }

}






function tokenize(content) {
  const lineReader = new LineReader(input.match(/[^\r\n]+/g))
  let tokenLines = []



  let text = ""




  while (lineReader.hasNext()) {
    const nextLine = lineReader.next()
    let tokens = []

    let pushText = () => {

      if (text.length != 0) {
        tokens.push(text)
        text = ""
      }

    }

    let pushIfFirst = (token, tokenName) => {
      if (reader.isFirst()) {
        tokens.push(tokenName)
      } else {
        text += token
      }
    }

    reader = new Reader(nextLine)





    while (reader.hasNext()) {
      const next = reader.next()





      switch (next) {

        case '-':
          pushIfFirst(next, 'LIST_ITEM')
          break;

        case '>':
          pushIfFirst(next, 'BLOCKQUOTE')
          break;

        case '#':
          headerLevel = 1
          for (let i = 0; i < 6; i++) {
            if (reader.peek(i) == '#') {
              headerLevel++
            }
          }

          pushIfFirst(next, 'HEADER_' + headerLevel)

          for (let i = 0; i < headerLevel; i++) {
            reader.next()
          }
          break;


        case "*":
          pushText()

          if (reader.peek() == "*") {
            reader.next()
            tokens.push('STRONG')
          } else {
            tokens.push('ITALIC')
          }
          break;


        case "[":
          pushText()
          tokens.push('OPEN_BRACKET')
          break;

        case "]":
          pushText()
          tokens.push('CLOSE_BRACKET')
          break;

        case "(":
          pushText()
          tokens.push('OPEN_PARENTHESIS')
          break;

        case ")":
          pushText()
          tokens.push('CLOSE_PARENTHESIS')
          break;

        case "!":
          pushText()
          if (reader.peek() == "[") {
            tokens.push('EXCLAMATION')
          }
          break;

        case "\\":
          text += reader.next()
          break;

        default:
          text += next
          break;

      }
    }

    pushText()
    tokenLines.push(tokens)
  }

  return tokenLines
}


tokenLines = tokenize(input)


console.log(tokenLines)


class Parser {
  constructor(tokenLines) {
    this.tokenLineReader = new LineReader(tokenLines)
    this.tokenReader = null
  }



  execute() {
    const nodes = []

    while (this.tokenLineReader.hasNext()) {

      this.tokenReader = new Reader(this.tokenLineReader.next())



      nodes.push(this.parseLine())


    }




    return {
      node: 'root',
      children: nodes
    }

  }




  parseLine() {

    while (this.tokenReader.hasNext()) {

      const peekNext = this.tokenReader.peek()

      if (peekNext.includes('HEADER_')) {


        return this.parseHeader()
      } else if (peekNext == 'BLOCKQUOTE') {
        return this.parseBlockquote()
      } else if (peekNext == 'LIST_ITEM') {

        return this.parseList()

      } else {

        return this.parsePara()
      }
    }

  }

  parseList() {

    let listItems = []


    listItems.push(this.parseListItem())

    while (this.tokenLineReader.hasNext() && this.tokenLineReader.peek()[0] == 'LIST_ITEM') {

      this.tokenReader = new Reader(this.tokenLineReader.next())

      if (this.tokenReader.peek() == 'LIST_ITEM') {

        listItems.push(this.parseListItem())
      }
    }


    return {
      node: 'element',
      tag: 'ul',
      children: listItems
    }
  }

  parseListItem() {
    this.tokenReader.next() //skip LIST_ITEM
    let text = this.parseTextLine()

    return {
      node: 'element',
      tag: 'li',
      children: text
    }

  }

  parseImage() {
    this.tokenReader.next() // skip EXCLAMATION
    this.tokenReader.next() // skip OPEN_BRACKET

    let alt = this.tokenReader.next()

    this.tokenReader.next() // skip CLOSE_BRACKET
    this.tokenReader.next() // skip OPEN_PARENTHESIS

    let src = this.tokenReader.next()

    this.tokenReader.next() // skip CLOSE_PARENTHESIS

    return {
      node: 'element',
      tag: 'img',
      attributes: {
        src: src,
        alt: alt
      }
    }

  }

  parseHeader() {
    let next = this.tokenReader.next()
    let headerLevel = next[next.length - 1]

    return {
      node: 'element',
      tag: 'h' + headerLevel,
      children: [this.parseTextNode()]
    }
  }

  parsePara() {

    let node = {
      node: 'element',
      tag: 'p',
      children: this.parseTextLine()
    }


    return node
  }

  parseBlockquote() {
    this.tokenReader.next() // skip BLOCKQUOTE
    let text = this.parseTextLine()

    return {
      node: 'element',
      tag: 'blockquote',
      children: text
    }
  }

  parseHyperlink() {
    this.tokenReader.next() // skip OPEN_BRACKET

    let text = this.parseTextLine('CLOSE_BRACKET')

    this.tokenReader.next() // skip CLOSE_BRACKET
    this.tokenReader.next() // skip OPEN_PARENTHESIS

    let href = this.tokenReader.next()

    this.tokenReader.next() // skip CLOSE_PARENTHESIS


    return {
      node: 'element',
      tag: 'a',
      attributes: { href: href },
      children: text
    }
  }



  parseItalic() {

    this.tokenReader.next() //skip the ITALIC delimiter

    let children = []
    while(this.tokenReader.peek() != 'ITALIC'){
        children = this.parseTextLine('ITALIC')
    }


    
    this.tokenReader.next() //skip the ITALIC delimiter

    return {
      node: 'element',
      tag: 'i',
      children: children
    }
  }


  parseStrong() {

    this.tokenReader.next() //skip the STRONG delimiter

    let children = []
    while(this.tokenReader.peek() != 'STRONG'){
        children = this.parseTextLine('STRONG')
    }


    
    this.tokenReader.next() //skip the STRONG delimiter

    return {
      node: 'element',
      tag: 'strong',
      children: children
    }
  }



  //returns a single textNode
  parseTextNode() {
    let next = this.tokenReader.next()
    return {
      node: 'text',
      text: next
    }
  }


  parseTextLine(until = "") {

    let elements = []

    while (this.tokenReader.hasNext() && this.tokenReader.peek() != until ) {
      
      let peekNext = this.tokenReader.peek()
      


      if (peekNext == 'ITALIC') {
        elements.push(this.parseItalic())
      } else if (peekNext == 'STRONG') {
        elements.push(this.parseStrong())
      } else if (peekNext == 'EXCLAMATION') {
        elements.push(this.parseImage())
      } else if (peekNext == 'OPEN_BRACKET') {
        elements.push(this.parseHyperlink())
      } else {

        elements.push(this.parseTextNode())
      }

    }

    return elements
  }


}





let parser = new Parser(tokenLines)

let nodes = parser.execute()


console.log(JSON.stringify(nodes, null, 3))



function parseDomNodes(tree) {

  let children = ''
  if (tree.children) {

    children = tree.children.map(child => parseDomNodes(child)).join('')
    console.log(children)
  }

  let attributes = ''
  if (tree.attributes) {
    attributes = Object.keys(tree.attributes).map((key) => {
      let value = tree.attributes[key]

      return `${key} = '${value}'`
    }).join(' ')
  }

  if (tree.node == 'element') {
    let tag = tree.tag
    let open = `<${tag} ${attributes}>`
    let close = `</${tag}>`


    // console.log('children:',children)
    return open + children + close
  }


  if (tree.node == 'text') {
    return tree.text
  }




  if (tree.node == 'root') {
    return children
  }
}



// console.log(parseDomNodes(nodes))



document.getElementById('root').innerHTML = parseDomNodes(nodes)












lines = input.match(/[^\r\n]+/g)

let output = ""
// this is the functional code

for (let [lineIdx, line] of lines.entries()) {
  let inputIdx = 0
  let headerType = 1

  //headers
  if (line[inputIdx] == "#") {

    if (line[inputIdx + 1] == "#") {
      headerType++

      if (line[inputIdx + 2] == "#") {
        headerType++
      }
    }

    output += '<h' + headerType + '>'
    for (i = headerType; i < line.length; i++) {

      output += line[i]
    }
    output += '</h' + headerType + '>'
  }
  // blockquotes
  else if (line[inputIdx] == ">") {

    output += '<blockquote>'

    for (i = 1; i < line.length; i++) {
      output += line[inputIdx + i]
    }

    output += '</blockquote>'

  }
  //unordered lists
  else if (line[inputIdx] == "-") {

    if (lines[lineIdx - 1] ?.[0] != "-") {
      output += '<ul>'
    }

    output += '<li>'

    for (i = 1; i < line.length; i++) {
      output += line[inputIdx + i]
    }
    output += '</li>'

    if (lines[lineIdx + 1] ?.[0] != "-") {
      output += '</ul>'
    }
  }
  //paragraphs
  else {

    output += '<p>'

    for (i = 0; i < line.length; i++) {


      //strong and italic tags
      if (line[i] == "*") {


        if (line[i + 1] == "*") {

          //strong tags
          i += 1

          output += '<strong>'

          let j = i + 1
          while (line[j] != "*") {
            output += line[j]
            j++
          }

          output += '</strong>'

          i = j + 2

        } else {
          //italic tags
          output += '<i>'

          let j = i + 1
          while (line[j] != "*") {
            output += line[j]
            j++
          }

          output += '</i>'

          i = j + 1

        }
      }


      //links
      if (line[i] == "[") {
        let link = ""

        let content = ""

        //get content inside []
        let j = i + 1
        while (line[j] != "]") {

          content += line[j]
          j++
        }

        //get link inside ()
        j = j + 2

        while (line[j] != ")") {

          link += line[j]
          j++
        }

        i = j + 1


        output += "<a href=" + link + "/>" + content + "</a>"
      }
      //images
      if (line[i] == "!") {
        let link = ""

        let content = ""

        //get content inside []
        let j = i + 2
        while (line[j] != "]") {

          content += line[j]
          j++
        }

        //get link inside ()
        j = j + 2

        while (line[j] != ")") {

          link += line[j]
          j++
        }

        i = j + 1

        output += "<img src=" + link + "alt=" + content + "/>"
      }
      if (line[i]) {
        output += line[i]
      }
    }
    output += '</p>'
  }
}



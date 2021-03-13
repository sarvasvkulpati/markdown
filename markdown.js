


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


  reset() {
    this.idx = 0
  }


  // only works with chars, not token lists
  readUntilText() {
    let text = ""

    while (this.hasNext() && this.peek() == " ") {
      text += this.next()
    }
    return text
  }

  isFirst() {

    return this.idx == 1
  }

  isFirstNonWhitespace() {
    return this.line.slice(0, this.idx - 1).split('').every(val => val == ' ')
  }

}


// reader class that returns the lines in the input content
class LineReader {

  constructor(lines) {
    this.lines = lines
    this.idx = 0
  }

  backtrack() {
    this.idx--
  }

  peek(k = 0) {

    return this.lines[this.idx + k]
  }

  next() {



    return this.lines[this.idx++]



  }

  hasNext() {

    try {
      return this.idx < this.lines.length
    } catch (err) {
      return false
    }
   
  }

}






function tokenize(content) {
  const lineReader = new LineReader(content.match(/[^\r\n]+/g))
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

        case ' ':


          if (reader.isFirst()) {
            let indent = reader.readUntilText()
            tokens.push(indent)

            //TODO now indented lines don't work because reader.isFirst isn't true for the LIST_ITEM of a line with spaces in front of it
          }
          else {
            text += next
          }

          break;

        case '-':

          if (reader.isFirstNonWhitespace()) {
            tokens.push('LIST_ITEM')
          } else {
            text += next
          }

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

          if (reader.peek(-2) == ']') {

            pushText()
            tokens.push('OPEN_PARENTHESIS')
          } else {
            text += next
          }

          break;

        case ")":
          if (tokens.includes('OPEN_PARENTHESIS')) {
            pushText()
            tokens.push('CLOSE_PARENTHESIS')
          } else {
            text += next
          }

          break;

        case "!":
          
          if (reader.peek() == "[") {
            pushText()
            tokens.push('EXCLAMATION')
          } else {
            text += next
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


    let [firstIndentLevel, firstNode] = this.parseListItem()


    listItems.push(firstNode)


    while (this.tokenLineReader.hasNext() && (this.tokenLineReader.peek()[0] == 'LIST_ITEM' || this.tokenLineReader.peek()[1] == 'LIST_ITEM')) {

      this.tokenReader = new Reader(this.tokenLineReader.next())


      let [indentLevel, node] = this.parseListItem()


      if (indentLevel > firstIndentLevel) {
        this.tokenReader.reset()
        listItems.push(this.parseList())
      } else if (indentLevel < firstIndentLevel) {
        this.tokenLineReader.backtrack()

        node.children.push({
          node: 'element',
          tag: 'ul',
          children: listItems
        })
        return node
      } else {
        listItems.push(node)
      }




    }


    return {
      node: 'element',
      tag: 'ul',
      children: listItems
    }
  }

  parseListItem() {

    let indentLevel = 0

    const next = this.tokenReader.next() //this is either LIST_ITEM or an indent


    //if the first element is an indent
    if (next.trim().length == 0) {

      indentLevel = next.length   //get the indentLevel
      this.tokenReader.next()
    } //otherwise we don't care, LIST_ITEM has been skipped



    let text = this.parseTextLine()


    return [indentLevel, {
      node: 'element',
      tag: 'li',
      children: text
    }]

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
    while (this.tokenReader.hasNext() && this.tokenReader.peek() != 'ITALIC') {
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
    while (this.tokenReader.hasNext() && this.tokenReader.peek() != 'STRONG') {
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

    while (this.tokenReader.hasNext() && this.tokenReader.peek() != until) {

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








function parseDomNodes(tree) {

  let children = ''
  if (tree.children) {

    children = tree.children.map(child => parseDomNodes(child)).join('')

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





function toHTML(markdown){
  const tokens = tokenize(markdown)
  const parser = new Parser(tokens)
  const parsedMarkdown = parseDomNodes(parser.execute())
  return parsedMarkdown
}


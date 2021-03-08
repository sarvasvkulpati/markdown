/*

h1-6

*/


// let input = `

// # this is a header
// this is a *paragraph* of text
// this is another **paragraph** of text
// ![this is an image](https://via.placeholder.com/150) and some text after the image
// this is [   google    ](https://www.google.com)
// ## this is an h2
// ### this is an h3
// # another header
// <b>inline html</b>
// more paragraphs
// > to be or not to be a pencil - Gandhi
// - here's a point I'd like to make
// - and another one
// - aaaand another one
//   - this is an indented point



// `

let input = `

# this is a header

this is a *paragraph* of text

this is another **paragraph** of text

![this is an image](https://via.placeholder.com/150) and some text after the image

this is [   google    ](https://www.google.com)


- so yeah
- this is a point


## this is an h2
### this is an h3
# another header
<b>inline html</b>
more paragraphs
> to be or not to be a pencil - Gandhi

- here's a point I'd like to make
- and another one
- aaaand another one

`

let testInput = "this is a *paragraph* of text"





output = ""




// reader class that returns the chars in individual lines
class Reader {
  constructor(line) {
    this.content = line
    this.idx = 0
  }

  peek(k = 1) {
    return this.line[this.idx + k]
  }

  next() {

    if (this.line[idx]) {
      return this.line[idx++]
    } else {
      return 'END'
    }
  }

}


// reader class that returns the lines in the input content
class LineReader {

  constructor(content) {
    this.lines = content.match(/[^\r\n]+/g)
    this.idx = 0
  }

  prev() {
    if (idx > 0) {
      return this.lines[this.idx - 1]
    }
  }

  peek(k = 1) {
    return this.lines[this.idx + k]
  }

  next() {

    if (this.lines[this.idx]) {

      return this.lines[this.idx++]

    } else {
      return 'END'
    }

  }

}




function getIndent(line) {

  indentLevel = line.search(/\S|$/)



  return indentLevel
}



function tokenize(content) {
  lines = content.match(/[^\r\n]+/g)

  return lines.map(line => tokenizeLine(line))


}


function tokenizeLine(line) {

  let result = []
  let text = ""


  let headerLevel = 0

  let indentLevel = getIndent(line)

  for (let i = 0; i < indentLevel; i++) {
    result.push('INDENT')
  }

  line = line.trim() //remove spaces around the text (have the indent level so this is fine)

  let firstChar = line[0]





  for (let i = 0; i < 6; i++) {
    if (line[i] == "#") {
      headerLevel += 1
    }
  }




  switch (firstChar) {
    case "#":
      result.push('HEADER_' + headerLevel)
      break;

    case ">":
      headerLevel += 1

      result.push('BLOCKQUOTE')

      break;

    case "-":
      headerLevel += 1

      result.push('LIST_ITEM')

      break;

  }




  //paragraph

  // the funky headerLevel thing is to skip the first space if a header is present
  for (let i = 0 + (headerLevel > 0 ? headerLevel + 1 : 0); i < line.length; i++) {

    let char = line[i]
    switch (char) {

      case "*":

        if (line[i + 1] == "*") {     // peek forward one

          if (text.length != 0) {
            result.push(text)
            text = ""             //push and refresh text cache
          }


          result.push('STRONG')
          i++                      //skip one
        }

        else {
          if (text.length != 0) {
            result.push(text)
            text = ""             //push and refresh text cache
          }

          result.push('ITALIC')
        }



        break;

      case "[":

        if (text.length != 0) {
          result.push(text)
          text = ""             //push and refresh text cache
        }


        result.push('OPEN_BRACKET')
        break;

      case "]":
        if (text.length != 0) {
          result.push(text.trim())
          text = ""             //push and refresh text cache
        }


        result.push('CLOSE_BRACKET')
        break;

      case "(":
        result.push('OPEN_PARENTHESIS')
        break;

      case ")":
        result.push(text)
        text = ""             //push and refresh text cache
        result.push('CLOSE_PARENTHESIS')
        break;

      case "!":
        if (line[i + 1] == "[") {
          result.push('EXCLAMATION')
        }
        break;


      default:

        text += char

        break;


    }


  }
  if (text.length != 0) {
    result.push(text)
  }

  return (result)
}


// console.log(tokenizeLine('this is a *paragraph* of text'))

tokens = tokenize(input)


specialTokens = ['HEADER_1',
  'HEADER_2',
  'HEADER_3',
  'HEADER_4',
  'HEADER_5',
  'HEADER_6',
  'ITALIC',
  'STRONG',
  'EXCLAMATION',
  'OPEN_BRACKET',
  'CLOSE_BRACKET',
  'OPEN_PARENTHESIS',
  'CLOSE_PARENTHESIS',
  'LIST_ITEM',
  'BLOCKQUOTE',
  'INDENT']



function isText(string) {
  return !specialTokens.some(token => string.includes(token))

}







console.log(tokens)

// use logic from below but with tokens, use a switch statement for first char

class Tree {
  constructor(value) {
    this.value = value
    this.children = [];
  }






}



//LINUS read this

function parseLines(tokenizedLines) {
  let output = { value: 'html', children: [] }





  let listNode = { value: 'ul', children: [] }

  for (let i = 0; i < tokenizedLines.length; i++) {

    let node = { value: '', children: [] }


    let line = tokenizedLines[i]


    let styleNode = { value: '', children: [] }

    let inBrackets = false
    let inParentheses = false

    let inList = false

    for (let i = 0; i < line.length; i++) {

      //based on the first token, what kind of node is the line?
      if (i == 0) {





        if (line[i].includes('HEADER_')) {
          let headerLevel = line[i][line[i].length - 1]

          node.value = 'h' + headerLevel
          continue;
        }

        switch (line[i]) {
          case 'BLOCKQUOTE':
            node.value = 'blockquote'
            continue;

          case 'LIST_ITEM':
            inList = true
            continue;

          default:
            node.value = 'p'
            break;
        }

      }


      console.log(listNode.children, inList)
      if (listNode.children.length > 0 && inList == false) {


        output.children.push({ ...listNode })
        listNode.children = []

      }



      switch (line[i]) {
        case 'ITALIC':

          if (styleNode.value == 'i') {

            node.children.push({ ...styleNode })
            styleNode = { value: '', children: [] }

          } else {
            styleNode.value = 'i'

          }

          break;

        case 'STRONG':

          if (styleNode.value == 'strong') {
            node.children.push({ ...styleNode })
            styleNode = { value: '', children: [] }

          } else {
            styleNode.value = 'strong'

          }

          break;


        case 'EXCLAMATION':

          styleNode.value = 'img'


          break;


        case 'OPEN_BRACKET':
          inBrackets = true
          if (styleNode.value != 'img') {
            styleNode.value = 'a'
          }

          break;

        case 'CLOSE_BRACKET':
          inBrackets = false
          break;

        case 'OPEN_PARENTHESIS':
          inParentheses = true
          break;

        case 'CLOSE_PARENTHESIS':
          inParentheses = false
          node.children.push({ ...styleNode })
          styleNode = { value: '', children: [] }

          break;


        default:

          if (styleNode.value != '') {

            switch (styleNode.value) {
              case 'img':

                if (inBrackets) {
                  styleNode.alt = line[i]

                } else if (inParentheses) {
                  styleNode.src = line[i]

                }
                break;

              case 'a':
                if (inBrackets) {
                  styleNode.children = line[i]
                } else if (inParentheses) {
                  styleNode.href = line[i]
                }

                break;





              default:
                styleNode.children.push(line[i])
                break;
            }
          } else if (inList) {



            listNode.children.push(line[i])
            inList = false
            continue;

          } else {
            node.children.push(line[i])
          }

          break;
      }
    }




    if (listNode.children.length == 0) {
      output.children.push(node)
    }





  }

  if (listNode.children.length > 0) {


    output.children.push({ ...listNode })
    listNode.children = []

  }

  console.log(JSON.stringify(output, null, 2))

}

parseLines(tokens)









// function makeTree(tokens, prevTree = null, prevDelimiter = "", isPrevText = false) {


//   if (isPrevText) {
//     root.children.push(prevTree)
//   }

//   switch (tokens[0]) {

//     case "HEADER_1":
//       let headerTree = new Tree('HEADER_1')


//       tokens.shift()
//       makeTree(tokens, headerTree, '', false )
//       break;

//     default:
//       if (prevTree) {
//         prevTree.children.push(tokens[0])


//         tokens.shift()

//         makeTree(tokens, prevTree, '', true)
//       } else {


//         let pTree = new Tree('paragraph')
//         pTree.children.push(tokens[0])


//       }

//   }



// }


function makeTree(tokens) {
  let root = new Tree('html')

  let i = 0

  while (tokens[i + 1]) {
    currentToken = tokens[i]
    nextToken = tokens[i + 1]


    switch (currentToken) {
      case 'HEADER_1':
        let headerTree = new Tree('HEADER_1')
        headerTree.children.push(nextToken)
        root.children.push(headerTree)
        i++
        break;

      default:
        let pTree = new Tree('paragraph')

        pTree.children.push(currentToken)

        if (isText(nextToken)) {
          root.children.push(pTree)
        }

    }


  }


  return root
}

















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


document.getElementById('root').innerHTML = output

// document.getElementById('root').innerHTML = newOutput








// good parsers are recursive descent parsers, the rest is BS




/*
Reader

input: entire text string
outputs: list of tokens


reader just has the string and where we are in the string

the tokenizer 


tokens are what each 'thing' is 


in lisp a reader is a parser that's available as a function of the language
*/




/*
Tokenizer and lexer are the same thing 


*/


/*

text -> tokens -> syntax tree

*/




/*
in md, every line is fairly self contained (header will stay to one line)

so you can technically parse line by line, except for lists


LineReader allows you to check if something is a line

*/
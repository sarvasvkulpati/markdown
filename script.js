/*

h1-6

*/


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
- and another one
- aaaand another one
  - this is an indented point




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

  console.log(indentLevel)

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

  for(let i = 0; i <indentLevel; i++){
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

          result.push(text)
          text = ""             //push and refresh text cache


          result.push('STRONG')
          i++                      //skip one
        }

        else {
          result.push(text)
          text = ""             //refresh text cache

          result.push('ITALIC')
        }



        break;

      case "[":
        result.push(text)
        text = ""             //push and refresh text cache

        result.push('OPEN_BRACKET')
        break;

      case "]":
        result.push(text.trim()) //remove whitespace around (but not inside) string if it's inside a link
        text = ""             //push and refresh text cache


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
  result.push(text)
  return (result)
}


// console.log(tokenizeLine('this is a *paragraph* of text'))

console.log(tokenize(input))




function parse(tokens) {
  // header + text


  // italic + text + italic

  // strong + text + strong


  // exclamation + OPEN_BRACKET + text + CLOSE_BRACKET + OPEN_PARENTHESIS + text + CLOSE_PARENTHESIS

  // OPEN_BRACKET + text + CLOSE_BRACKET + OPEN_PARENTHESIS + text + CLOSE_PARENTHESIS

  // BLOCKQUOTE + text

  // LIST_ITEM + text
}











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
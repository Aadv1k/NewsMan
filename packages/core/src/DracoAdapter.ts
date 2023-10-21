import * as draco from "dracoql";

export interface DQLHtmlElement {
  tag: string;
  attributes: {
    href?: string;
    src?: string;
    alt?: string;
  };
  children: Array<DQLHtmlElement>;
}

export interface DQLObject {
  type: 'JSON' | 'HTML';
  value: DQLHtmlElement;
}

export interface DQLFlatObject {
  headings: string[];
  links: {
    href: string;
    text: string;
  }[];
  paragraphs: string[];
  images: {
    src: string;
    alt: string;
  }[];
}

export function serializeDQLHtmlElementToObject(element: DQLHtmlElement): DQLFlatObject {
    const flatObject: DQLFlatObject = {
      headings: [],
      links: [],
      paragraphs: [],
      images: [],
    };


    function processElement(node: DQLHtmlElement) {
      if (!node.tag) return;

      switch (node.tag) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
           let heading;
              try {
                  heading = node.children.map((e: any) => {
                      if (e?.tag) return e.children?.[0].text.trim()
                      return e?.text.trim()
                  }).filter(e => e.length).pop();

              } catch {
                  const elem = node.children.filter(e => e?.children?.length).pop();
                  heading = elem?.children.map((e: any) => e?.text).pop();
              }

          flatObject.headings.push(heading || '');
          break;
        case 'a':
          if ((node.children[0] as any)?.type === 'TextNode') {
            flatObject.links.push({ href: node.attributes.href || '', text: (node.children[0] as any).text });
          } else if (node.children[0]?.tag === 'img') {
            flatObject.images.push({ src: node.children[0].attributes.src || '', alt: node.children[0].attributes.alt || '' });
          }
          break;
        case 'img':
          flatObject.images.push({ src: node.attributes.src || '', alt: node.attributes.alt || '' });
          break;
        case 'p':
          flatObject.paragraphs.push((node.children[0] as any)?.text || '');
          break;
        case 'article':
        case 'div':
        case 'li':
        case 'figure':
        case 'figcaption':
          break;
        default:
          throw new Error(`ERROR unhandled tag: ${node.tag}`);
      }

      if (node.children) {
        for (const child of node.children) {
          processElement(child);
        }
      }
    }
    processElement(element);
    return flatObject;
  }

export async function runQueryAndGetVars(query: string) {
    let dracoLexer, dracoParser, dracoInterpreter;

    try {
      dracoLexer = new draco.lexer(query);
      dracoParser = new draco.parser(dracoLexer.lex());
      dracoInterpreter = new draco.interpreter(dracoParser.parse());
    } catch (error: any) {
      throw new Error(`ERROR: unable to parse DracoQL due to error: ${error.message}`);
    }

    try {
      await dracoInterpreter.run();
    } catch (error: any) {
      throw new Error(`ERROR: unable to fetch headlines due to DracoQL error: ${error.message}`);
    }

    return dracoInterpreter.NS;
}

import * as draco from "dracoql";

export interface DQLTextNode {
  type: string;
  text: string;
}

export interface DQLHtmlElement {
  tag: string;
  attributes: {
    href?: string;
    src?: string;
    alt?: string;
  };
  children: Array<DQLHtmlElement>;
}

export interface DQLFlatObject {
  headings: string[];
  links: { href: string; text: string }[];
  paragraphs: string[];
  images: { src: string; alt: string }[];
}

export interface DQLObject {
  type: "JSON" | "HTML";
  value: DQLHtmlElement;
}

export function serializeDQLHtmlElementToObject(
  element: DQLHtmlElement
): DQLFlatObject {
  const flatObject: DQLFlatObject = {
    headings: [],
    links: [],
    paragraphs: [],
    images: [],
  };

  function extractTextFromElement(node: DQLHtmlElement): string {
    const textNodes = (node.children || [])
      .map((child) => {
        if (child.tag === "a" || child.tag === "img") {
          return extractTextFromElement(child);
        } else {
          return child.tag === "p"
            ? child.attributes.alt
            : extractTextFromElement(child);
        }
      })
      .filter((text) => text);

    return textNodes.pop() || "";
  }

  function processElement(node: DQLHtmlElement) {
    if (!node.tag) return;

    switch (node.tag) {
      case "h1":
      case "h2":
      case "h3":
      case "h4":
      case "h5":
      case "h6":
        const heading = extractTextFromElement(node);
        flatObject.headings.push(heading);
        break;
      case "a":
        if ((node.children[0] as any)?.type === "TextNode") {
          flatObject.links.push({
            href: node.attributes.href || "",
            text: (node.children[0] as any)?.text,
          });
        } else if (node.children[0]?.tag === "img") {
          flatObject.images.push({
            src: node.children[0].attributes.src || "",
            alt: node.children[0].attributes.alt || "",
          });
        }
        break;
      case "img":
        flatObject.images.push({
          src: node.attributes.src || "",
          alt: node.attributes.alt || "",
        });
        break;
      case "span":
      case "p":
      case "small":
        flatObject.paragraphs.push(extractTextFromElement(node));
        break;
      case "article":
      case "script":
      case "ul":
      case "samp":
      case "div":
      case "section":
      case "li":
      case "figure":
      case "figcaption":
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
    throw new Error(
      `ERROR: unable to parse DracoQL due to error: ${error.message}`
    );
  }

  try {
    await dracoInterpreter.run();
  } catch (error: any) {
    throw new Error(
      `ERROR: unable to fetch headlines due to DracoQL error: ${error.message}`
    );
  }

  return dracoInterpreter.NS;
}

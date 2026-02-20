import { Descendant, Element, Text } from "slate";

const EMPTY_PARAGRAPH: Descendant = {
  type: "paragraph",
  children: [{ text: "" }],
};

export const INITIAL_SLATE_VALUE: Descendant[] = [EMPTY_PARAGRAPH];

function ensureChildren(children: Descendant[]): Descendant[] {
  return children.length > 0 ? children : [{ text: "" }];
}

function flattenToText(children: Descendant[]): Descendant[] {
  const textNodes = children.flatMap((child) => {
    if (Text.isText(child)) {
      return [child];
    }

    return flattenToText(child.children);
  });

  return textNodes.length > 0 ? textNodes : [{ text: "" }];
}

function applyMark(children: Descendant[], mark: "bold" | "italic" | "underline"): Descendant[] {
  return children.map((child) => {
    if (Text.isText(child)) {
      return { ...child, [mark]: true };
    }

    return {
      ...child,
      children: applyMark(child.children, mark),
    };
  });
}

function deserializeNode(node: ChildNode): Descendant[] {
  if (node.nodeType === Node.TEXT_NODE) {
    return [{ text: node.textContent ?? "" }];
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return [];
  }

  const element = node as HTMLElement;
  const tag = element.tagName.toLowerCase();
  const childNodes = Array.from(element.childNodes);
  const children = ensureChildren(childNodes.flatMap(deserializeNode));

  switch (tag) {
    case "body": {
      const bodyChildren = childNodes.flatMap(deserializeNode);
      return bodyChildren.length > 0 ? bodyChildren : INITIAL_SLATE_VALUE;
    }
    case "strong":
    case "b":
      return applyMark(children, "bold");
    case "em":
    case "i":
      return applyMark(children, "italic");
    case "u":
      return applyMark(children, "underline");
    case "ul": {
      const listItems = children
        .filter((child): child is Element => Element.isElement(child) && child.type === "list-item")
        .map((child) => ({
          type: "list-item" as const,
          children: flattenToText(child.children),
        }));

      return [
        {
          type: "bulleted-list",
          children: listItems.length > 0 ? listItems : [{ type: "list-item", children: [{ text: "" }] }],
        },
      ];
    }
    case "ol": {
      const listItems = children
        .filter((child): child is Element => Element.isElement(child) && child.type === "list-item")
        .map((child) => ({
          type: "list-item" as const,
          children: flattenToText(child.children),
        }));

      return [
        {
          type: "numbered-list",
          children: listItems.length > 0 ? listItems : [{ type: "list-item", children: [{ text: "" }] }],
        },
      ];
    }
    case "li":
      return [
        {
          type: "list-item",
          children: flattenToText(children),
        },
      ];
    case "br":
      return [{ text: "\n" }];
    case "p":
    case "div":
    default:
      return [
        {
          type: "paragraph",
          children: ensureChildren(children),
        },
      ];
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function serializeText(node: Text): string {
  let text = escapeHtml(node.text).replace(/\n/g, "<br />");

  if (node.bold) {
    text = `<strong>${text}</strong>`;
  }
  if (node.italic) {
    text = `<em>${text}</em>`;
  }
  if (node.underline) {
    text = `<u>${text}</u>`;
  }

  return text;
}

function serializeNode(node: Descendant): string {
  if (Text.isText(node)) {
    return serializeText(node);
  }

  const children = node.children.map(serializeNode).join("");

  switch (node.type) {
    case "bulleted-list":
      return `<ul>${children}</ul>`;
    case "numbered-list":
      return `<ol>${children}</ol>`;
    case "list-item":
      return `<li>${children || "<br />"}</li>`;
    case "paragraph":
    default:
      return `<p>${children || "<br />"}</p>`;
  }
}

export function deserializeHtmlToSlate(html: string): Descendant[] {
  if (!html || html.trim().length === 0) {
    return INITIAL_SLATE_VALUE;
  }

  const parser = new DOMParser();
  const document = parser.parseFromString(html, "text/html");
  const nodes = deserializeNode(document.body).filter((node) => {
    if (Text.isText(node)) {
      return node.text.trim().length > 0;
    }

    return true;
  });

  if (nodes.length === 0) {
    return INITIAL_SLATE_VALUE;
  }

  if (nodes.some((node) => Text.isText(node))) {
    return [{ type: "paragraph", children: flattenToText(nodes) }];
  }

  return nodes;
}

export function serializeSlateToHtml(value: Descendant[]): string {
  if (!value || value.length === 0) {
    return "<p><br /></p>";
  }

  return value.map(serializeNode).join("");
}
import type { BaseEditor } from "slate";
import type { ReactEditor } from "slate-react";
import type { HistoryEditor } from "slate-history";

export type CustomText = {
  text: string;
  bold?: true;
  italic?: true;
  underline?: true;
};

export type CustomDescendant = CustomElement | CustomText;

export type ParagraphElement = {
  type: "paragraph";
  children: CustomDescendant[];
};

export type ListItemElement = {
  type: "list-item";
  children: CustomDescendant[];
};

export type BulletedListElement = {
  type: "bulleted-list";
  children: CustomDescendant[];
};

export type NumberedListElement = {
  type: "numbered-list";
  children: CustomDescendant[];
};

export type CustomElement =
  | ParagraphElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement;

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

export {};

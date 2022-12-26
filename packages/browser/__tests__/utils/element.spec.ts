import { parseElementAttribute } from "../../src/utils/element";

describe("element.ts", () => {
  it("解析element节点", () => {
    const element = document.createElement("div") as HTMLDivElement;
    element.className = "style1 style2";
    element.id = "test";
    element.setAttribute("name", "name");
    element.setAttribute("style", "width: 100px");

    const parseElement = parseElementAttribute(element);

    // @ts-ignore
    expect(parseElement.id).toEqual("test");
    // @ts-ignore
    expect(parseElement.name).toEqual("name");
    // @ts-ignore
    expect(parseElement.class).toEqual("style1 style2");
    // @ts-ignore
    expect(parseElement.style).toEqual("width: 100px");
  });
});

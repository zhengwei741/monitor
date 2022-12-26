export function parseElementAttribute(element: Element) {
  const { attributes } = element;
  return map(attributes, (key, value) => ({
    [value["name"]]: value["value"],
  }));
}

function map(obj, callblack) {
  let newMap = {};
  Object.keys(obj || {}).map((key) => {
    const v = callblack(key, obj[key], obj);
    newMap = {
      ...newMap,
      ...v,
    };
  });
  return newMap;
}

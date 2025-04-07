function removeEmojis(str: string): string {
  return str.replace(/([\u{1F300}-\u{1F5FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{1F700}-\u{1F77F}]|[\u{1F780}-\u{1F7FF}]|[\u{1F800}-\u{1F8FF}]|[\u{1F900}-\u{1F9FF}]|[\u{1FA00}-\u{1FA6F}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{FE00}-\u{FE0F}]|[\u{1F1E6}-\u{1F1FF}])/gu, ''); 
}
async function main() {
  await figma.loadAllPagesAsync();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const newPage = figma.createPage();
  newPage.name = "Collected Components";

  const ignoredComponentPrefixes = ["⛔️", "⛔", "🚧", "📘"];
  const shouldIgnoreComponent = (name: string) => {
    return ignoredComponentPrefixes.some(prefix => name.trim().startsWith(prefix));
  };

  const frameSpacing = 8;
  const pageSpacing = 8;
  const frameWidth = 400;
  const paddingTop = 14;
  const paddingSide = 20;
  const pagePadding = 36;

  let containerY = 0;

  const ignoredPageNames = [
    "d o c s",
    "c h a n g e    l o g",
    "o v e r v i e w",
    "l a b",
    "c h a r t s  l a b",
    "t o k e n s  d o c s",
    "ui direct-pro",
    "ui direct-light",
    "ui toola",
    "ui metrika",
    "internal"
  ];

  const updateComponentLink = (componentNode: ComponentNode): string => {
    if (componentNode.parent && componentNode.parent.type === "COMPONENT_SET") {
      return componentNode.parent.id;
    }
    return componentNode.id;
  };

  for (const page of figma.root.children) {

    if (page.type !== "PAGE") continue;
    const pageName = page.name.toLowerCase();

    if (ignoredPageNames.indexOf(pageName) !== -1) {
      continue;
    }

    const componentSets = page.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];
    const components = page.findAll(node => node.type === 'COMPONENT' && node.parent?.type !== 'COMPONENT_SET') as ComponentNode[];

    const allNodes = [...componentSets, ...components];
    allNodes.sort((a, b) => removeEmojis(a.name.trim()).localeCompare(removeEmojis(b.name.trim())));
    
    if (allNodes.length > 0) {

      const pageContainer = figma.createFrame();
      pageContainer.name = `${page.name}`
      pageContainer.layoutMode = 'VERTICAL';
      pageContainer.primaryAxisSizingMode = 'AUTO';
      pageContainer.counterAxisSizingMode = 'AUTO';
      pageContainer.fills = [];
      pageContainer.resize(1698, pageContainer.height);
      pageContainer.itemSpacing = pageSpacing;

      const pageLinkText = figma.createText();
      pageLinkText.characters = `${page.name}`
      pageLinkText.fontSize = 24;
      pageLinkText.lineHeight = { value: 32, unit: 'PIXELS' };
      pageLinkText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
      pageLinkText.hyperlink = {
        type: "NODE",
        value: page.id
      };

      const pageLinkHeader = figma.createFrame();
      pageLinkHeader.name = 'PageLinkHeader';
      pageLinkHeader.layoutMode = 'HORIZONTAL';
      pageLinkHeader.primaryAxisSizingMode = 'FIXED';
      pageLinkHeader.counterAxisSizingMode = 'AUTO';
      pageLinkHeader.primaryAxisAlignItems = 'MIN';
      pageLinkHeader.counterAxisAlignItems = 'MIN';
      pageLinkHeader.layoutAlign = 'STRETCH';
      pageLinkHeader.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1} }];
      pageLinkHeader.paddingTop = 28;
      pageLinkHeader.paddingBottom = 28;
      pageLinkHeader.paddingLeft = pagePadding;
      pageLinkHeader.paddingRight = pagePadding;
      pageLinkHeader.topLeftRadius = 0;
      pageLinkHeader.topRightRadius = 0;
      pageLinkHeader.bottomRightRadius = 14;
      pageLinkHeader.bottomLeftRadius = 14;   

      pageLinkHeader.appendChild(pageLinkText);

      const cardList = figma.createFrame();
      cardList.name = 'CardList';
      cardList.layoutMode = 'HORIZONTAL';
      cardList.primaryAxisSizingMode = 'FIXED';
      cardList.counterAxisSizingMode = 'AUTO';
      cardList.primaryAxisAlignItems = 'MIN';
      cardList.counterAxisAlignItems = 'MIN';
      cardList.itemSpacing = frameSpacing;
      cardList.layoutWrap = 'WRAP';
      cardList.fills = [];
      cardList.layoutAlign = 'STRETCH';
      cardList.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1} }];
      cardList.paddingTop = pagePadding;
      cardList.paddingBottom = pagePadding;
      cardList.paddingLeft = pagePadding;
      cardList.paddingRight = pagePadding;
      cardList.cornerRadius = 14;
      cardList.resizeWithoutConstraints(pageContainer.width - pagePadding * 2, cardList.height);

      const processComponent = (componentNode: ComponentNode, masterName: string, storybookLink?: string) => {
        const instance = componentNode.createInstance();
        instance.name = masterName;
      
        const cardItemHeader = figma.createText();
        cardItemHeader.name = 'CardItemHeader';
        const trimmedName = removeEmojis(masterName).trim();
        cardItemHeader.characters = trimmedName;
        cardItemHeader.fontSize = 16;
        cardItemHeader.lineHeight = { value: 24, unit: 'PIXELS' };
        cardItemHeader.layoutGrow = 1;
        cardItemHeader.hyperlink = {
          type: "NODE",
          value: updateComponentLink(componentNode)
        };
      
        const headerContainer = figma.createFrame();
        headerContainer.name = 'HeaderContainer';
        headerContainer.layoutMode = 'HORIZONTAL';
        headerContainer.primaryAxisSizingMode = 'AUTO';
        headerContainer.counterAxisSizingMode = 'AUTO';
        headerContainer.counterAxisAlignItems = 'CENTER';
        headerContainer.resize(frameWidth - (paddingSide * 2), headerContainer.height);
        headerContainer.fills = [];
      
        headerContainer.appendChild(cardItemHeader);
      
        if (storybookLink) {
          const cardItemCaption = figma.createText();
          cardItemCaption.name = 'CardItemCaption';
          cardItemCaption.characters = "Storybook";
          cardItemCaption.fontSize = 12;
          cardItemCaption.lineHeight = { value: 24, unit: 'PIXELS' };
          cardItemCaption.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
          cardItemCaption.opacity = 0.6;
          cardItemCaption.hyperlink = {
            type: "URL",
            value: storybookLink
          };
          headerContainer.appendChild(cardItemCaption);
        }

        const cardItem = figma.createFrame();
        cardItem.name = 'CardItem';
        cardItem.resize(frameWidth, 220);
        cardItem.cornerRadius = 14;
        cardItem.fills = [{ type: 'SOLID', color: {r: 0.9647, g: 0.9725, b: 0.9843} }];
        cardItem.strokes = [{ type: 'SOLID', color: {r: 0.9647, g: 0.9725, b: 0.9843} }];
        cardItem.strokeWeight = 2;
        cardItem.clipsContent = true;

        const divider = figma.createFrame();
        divider.name = 'Divider';
        divider.resize(frameWidth - (paddingSide * 2), 1);
        divider.fills = [{ type: 'SOLID', color: {r: 0.91, g: 0.92, b: 0.94} }];

        headerContainer.x = paddingSide;
        headerContainer.y = paddingTop;
        divider.x = paddingSide;
        divider.y = headerContainer.y + headerContainer.height + 12;
        instance.x = paddingSide;
        instance.y = divider.y + divider.height + 12;

        cardItem.appendChild(headerContainer);
        cardItem.appendChild(divider); 
        cardItem.appendChild(instance);
        const cardItemExtraPadding = figma.createFrame();
        cardItemExtraPadding.name = 'Card Item Extra Padding';
        cardItemExtraPadding.layoutMode = 'VERTICAL';
        cardItemExtraPadding.primaryAxisSizingMode = 'AUTO';
        cardItemExtraPadding.counterAxisSizingMode = 'AUTO';
        cardItemExtraPadding.fills = [];
        cardItemExtraPadding.paddingBottom = 8;
        cardItemExtraPadding.appendChild(cardItem);
        cardItemExtraPadding.layoutGrids;

        cardList.appendChild(cardItemExtraPadding);
      };

      for (const node of allNodes) {
        if (shouldIgnoreComponent(node.name)) {
          continue;
        }

        let storybookLink = "";
        if (node.documentationLinks && node.documentationLinks.length > 0) {
          storybookLink = node.documentationLinks[0].uri;
        }

        if (node.type === 'COMPONENT_SET') {
          const variants = node.children.filter(child => child.type === 'COMPONENT') as ComponentNode[];
          if (variants.length > 0) {
            processComponent(variants[0], node.name, storybookLink);
          }
        } else if (node.type === 'COMPONENT') {
          processComponent(node, node.name, storybookLink);
        }
      }

      pageContainer.appendChild(pageLinkHeader);
      pageContainer.appendChild(cardList);
      pageContainer.x = 0;
      pageContainer.y = containerY;
      newPage.appendChild(pageContainer);

      containerY += pageContainer.height + 60;
    }
  }

  await figma.setCurrentPageAsync(newPage);
  figma.closePlugin();
}

main();
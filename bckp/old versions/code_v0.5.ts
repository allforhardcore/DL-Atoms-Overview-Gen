async function main() {
  await figma.loadAllPagesAsync();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });
  


  const newPage = figma.createPage();
  newPage.name = "Collected Components";

  const frameSpacing = 8;
  const pageSpacing = 8;
  const frameWidth = 324;
  const paddingTop = 14;
  const paddingSide = 20;
  const pagePadding = 36;

  let containerY = 0;

  for (const page of figma.root.children) {
    if (page.type !== "PAGE") continue;

    const componentSets = page.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];

    if (componentSets.length > 0) {

      // Контейнер для текущей страницы
      const pageContainer = figma.createFrame();
      pageContainer.name = `${page.name}`;
      pageContainer.layoutMode = 'VERTICAL';
      pageContainer.primaryAxisSizingMode = 'AUTO';
      pageContainer.counterAxisSizingMode = 'AUTO';
      pageContainer.fills = [];
      pageContainer.resize(1724, pageContainer.height);
      pageContainer.itemSpacing = pageSpacing;

      // Заголовок страницы
      const pageLinkText = figma.createText();
      pageLinkText.characters = `${page.name}`;
      pageLinkText.fontSize = 24;
      pageLinkText.lineHeight = { value: 32, unit: 'PIXELS' };
      pageLinkText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
      pageLinkText.hyperlink = {
        type: "NODE",
        value: page.id
      };

      // Контейнер для заголовка страницы
      const pageLinkHeader = figma.createFrame();
      pageLinkHeader.layoutMode = 'HORIZONTAL';
      pageLinkHeader.primaryAxisSizingMode = 'FIXED';
      pageLinkHeader.counterAxisSizingMode = 'AUTO';
      pageLinkHeader.primaryAxisAlignItems = 'MIN';
      pageLinkHeader.counterAxisAlignItems = 'MIN';
      pageLinkHeader.layoutAlign = 'STRETCH';
      pageLinkHeader.fills = [{ type: "SOLID", color: { r: 1, g: 1, b: 1} }];
      pageLinkHeader.paddingTop = pagePadding;
      pageLinkHeader.paddingBottom = pagePadding;
      pageLinkHeader.paddingLeft = pagePadding;
      pageLinkHeader.paddingRight = pagePadding;
      pageLinkHeader.topLeftRadius = 0;
      pageLinkHeader.topRightRadius = 0;
      pageLinkHeader.bottomRightRadius = 14;
      pageLinkHeader.bottomLeftRadius = 14;   
            
      pageLinkHeader.appendChild(pageLinkText);
      
      // Контейнер для карточки
      const cardList = figma.createFrame();
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

      for (const componentSet of componentSets) {
        if (componentSet.name.trim().startsWith('⛔️')) {
          continue;
        }

        const variants = componentSet.children.filter(node => node.type === 'COMPONENT') as ComponentNode[];

        if (variants.length > 0) {
          const firstVariant = variants[0];
          const instance = firstVariant.createInstance();

          const cardItemHeader = figma.createText();
          let componentName = componentSet.name;
          let trimmedName = componentName.split('_')[0];
          cardItemHeader.characters = trimmedName.length > 2 ? trimmedName.substring(2).replace(/^\s+/, '') : trimmedName.replace(/^\s+/, '');
          cardItemHeader.fontSize = 16;
          cardItemHeader.lineHeight = { value: 24, unit: 'PIXELS' };
          cardItemHeader.layoutGrow = 1;
          cardItemHeader.hyperlink = {
            type: "NODE",
            value: componentSet.id
          };

          // Ссылка на Сторибук
          const cardItemCaption = figma.createText();
          cardItemCaption.characters = "Storybook";
          cardItemCaption.fontSize = 12;
          cardItemCaption.lineHeight = { value: 24, unit: 'PIXELS' };
          cardItemCaption.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
          cardItemCaption.opacity = 0.6;

          const headerContainer = figma.createFrame();
          headerContainer.layoutMode = 'HORIZONTAL'; 
          headerContainer.primaryAxisSizingMode = 'AUTO';
          headerContainer.counterAxisSizingMode = 'AUTO';
          headerContainer.resize(frameWidth - (paddingSide * 2), headerContainer.height);
          headerContainer.fills = [];
          
          headerContainer.appendChild(cardItemHeader);
          headerContainer.appendChild(cardItemCaption);

          const cardItem = figma.createFrame();
          cardItem.resize(frameWidth, 220);
          cardItem.cornerRadius = 14;
          cardItem.fills = [{ type: 'SOLID', color: {r: 0.9647, g: 0.9725, b: 0.9843} }];
          cardItem.clipsContent = true;

          headerContainer.x = paddingSide;
          headerContainer.y = paddingTop;
          instance.x = paddingSide;
          instance.y = headerContainer.y + headerContainer.height + 32;

          cardItem.appendChild(headerContainer);
          cardItem.appendChild(instance);

          // Создаем обертку cardItemExtraPadding
          const cardItemExtraPadding = figma.createFrame();
          cardItemExtraPadding.layoutMode = 'VERTICAL';
          cardItemExtraPadding.primaryAxisSizingMode = 'AUTO';
          cardItemExtraPadding.counterAxisSizingMode = 'AUTO';
          cardItemExtraPadding.fills = [];
          cardItemExtraPadding.paddingBottom = 8;
          cardItemExtraPadding.appendChild(cardItem);
          cardItemExtraPadding.layoutGrids;

          cardList.appendChild(cardItemExtraPadding);
        }
      }

      pageContainer.appendChild(pageLinkHeader);
      pageContainer.appendChild(cardList);
      pageContainer.x = 0;
      pageContainer.y = containerY;
      newPage.appendChild(pageContainer);

      containerY += pageContainer.height + pageSpacing;
    }
  }

  await figma.setCurrentPageAsync(newPage);
  figma.closePlugin();
}

main();
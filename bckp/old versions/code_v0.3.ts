async function main() {
  await figma.loadAllPagesAsync();
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  const newPage = figma.createPage();
  newPage.name = "Collected Components";

  const frameSpacing = 8;
  const pageSpacing = 80;
  const frameWidth = 540;
  const paddingTop = 48;
  const paddingSide = 48;
  const pagePadding = 120;

  let containerY = 0;

  for (const page of figma.root.children) {
    if (page.type !== "PAGE") continue;

    const componentSets = page.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];

    if (componentSets.length > 0) {
      const pageContainer = figma.createFrame();
      pageContainer.name = `${page.name}`;
      pageContainer.layoutMode = 'VERTICAL';
      pageContainer.primaryAxisSizingMode = 'AUTO';
      pageContainer.counterAxisSizingMode = 'AUTO';
      pageContainer.fills = [{ type: 'SOLID', color: { r: 0.94, g: 0.95, b: 0.97 } }];
      pageContainer.cornerRadius = 120;
      pageContainer.paddingTop = pagePadding;
      pageContainer.paddingBottom = pagePadding;
      pageContainer.paddingLeft = pagePadding;
      pageContainer.paddingRight = pagePadding;
      pageContainer.itemSpacing = pageSpacing;

      pageContainer.resize(4616, pageContainer.height);

      const pageLinkText = figma.createText();
      pageLinkText.characters = `${page.name}`;
      pageLinkText.fontSize = 130;
      pageLinkText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
      pageLinkText.hyperlink = {
        type: "NODE",
        value: page.id
      };
      pageContainer.appendChild(pageLinkText);

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
          cardItemHeader.fontSize = 48;

          const cardItemCaption = figma.createText();
          cardItemCaption.characters = "Storybook";
          cardItemCaption.fontSize = 24;
          cardItemCaption.lineHeight = { value: 32, unit: 'PIXELS' };
          cardItemCaption.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
          cardItemCaption.opacity = 0.6;

          cardItemHeader.hyperlink = {
            type: "NODE",
            value: componentSet.id
          };

          const cardItem = figma.createFrame();
          cardItem.resize(frameWidth, 540);
          cardItem.cornerRadius = 32;
          cardItem.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          cardItem.clipsContent = true;


cardItemHeader.x = paddingSide;
          cardItemHeader.y = paddingTop;
          cardItemCaption.x = paddingSide;
          cardItemCaption.y = cardItemHeader.y + cardItemHeader.height + 16;
          instance.x = paddingSide;
          instance.y = cardItemCaption.y + cardItemCaption.height + 32;

          cardItem.appendChild(cardItemHeader);
          cardItem.appendChild(cardItemCaption);
          cardItem.appendChild(instance);

          // Создаем обертку cardItemExtraPadding
          const cardItemExtraPadding = figma.createFrame();
          cardItemExtraPadding.layoutMode = 'VERTICAL';
          cardItemExtraPadding.primaryAxisSizingMode = 'AUTO';
          cardItemExtraPadding.counterAxisSizingMode = 'AUTO';
          cardItemExtraPadding.fills = []; // Устанавливаем фон без заливки
          cardItemExtraPadding.paddingBottom = 8;
          cardItemExtraPadding.appendChild(cardItem); // Оборачиваем оригинальный cardItem
          cardItemExtraPadding.layoutGrids 

          cardList.appendChild(cardItemExtraPadding);
        }
      }

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
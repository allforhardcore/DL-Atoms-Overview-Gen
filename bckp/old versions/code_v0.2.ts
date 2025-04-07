async function main() {
  // Загружаем все страницы, чтобы иметь возможность их обработать
  await figma.loadAllPagesAsync();

  // Предварительно загружаем шрифт "Inter Regular"
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Создаем новую страницу
  const newPage = figma.createPage();
  newPage.name = "Collected Components";

  const frameSpacing = 8;
  const pageSpacing = 60;
  const frameWidth = 540;
  const paddingTop = 48;
  const paddingSide = 48;
  const pagePadding = 120;

  // Переменные для отслеживания позиции контейнера и фреймов на новой странице
  let containerY = 0;

  // Проходим по всем существующим страницам
  for (const page of figma.root.children) {
    if (page.type !== "PAGE") continue;

    // Получаем все компонент-сеты на текущей странице
    const componentSets = page.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];

    // Проверяем, есть ли компонент-сеты на странице
    if (componentSets.length > 0) {
      // Создаем фрейм-контейнер для текущей страницы
      const pageContainer = figma.createFrame();
      pageContainer.name = `${page.name}`;
      pageContainer.layoutMode = 'VERTICAL';  // Используем вертикальный автолейаут для контейнера страницы
      pageContainer.primaryAxisSizingMode = 'AUTO';
      pageContainer.counterAxisSizingMode = 'AUTO';
      pageContainer.fills = [{ type: 'SOLID', color: { r: 0.69, g: 0.74, b: 0.84 }, opacity: 0.2}];
      pageContainer.cornerRadius = 120;
      pageContainer.paddingTop = pagePadding;
      pageContainer.paddingBottom = pagePadding;
      pageContainer.paddingLeft = pagePadding;
      pageContainer.paddingRight = pagePadding;
      pageContainer.itemSpacing = pageSpacing;

      // Устанавливаем фиксированную ширину для pageContainer
      pageContainer.resize(4616, pageContainer.height);

      // Создаем текстовую ноду для ссылки на страницу
      const pageLinkText = figma.createText();
      pageLinkText.characters =`${page.name}`;
      pageLinkText.fontSize = 144;
      pageLinkText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
      pageLinkText.hyperlink = {
        type: "NODE",
        value: page.id
      };
      pageContainer.appendChild(pageLinkText);

      // Создаем контейнер для карточек, применяя автолейаут
      const cardList = figma.createFrame();
      cardList.layoutMode = 'HORIZONTAL';  // Используем горизонтальный автолейаут для списка карточек
      cardList.resizeWithoutConstraints(pageContainer.width - 2*pagePadding, cardList.height);  // Устанавливаем ширину с учетом отступов
      cardList.primaryAxisSizingMode = 'FIXED';
      cardList.counterAxisSizingMode = 'AUTO';
      cardList.primaryAxisAlignItems = 'MIN';
      cardList.counterAxisAlignItems = 'MIN';
      cardList.itemSpacing = frameSpacing;
      cardList.layoutWrap = 'WRAP';  // Позволяем карточкам оборачиваться при недостатке места
      cardList.fills = [];

      for (const componentSet of componentSets) {
        // Проверяем, начинается ли имя компонент-сета с эмодзи ⛔️
        if (componentSet.name.trim().startsWith('⛔️')) {
          continue; // Пропускаем этот компонент-сет
        }
  
        // Получаем все компоненты (варианты) в компонент-сете
        const variants = componentSet.children.filter(node => node.type === 'COMPONENT') as ComponentNode[];

        if (variants.length > 0) {
          // Создаем инстанс из первого компонента
          const firstVariant = variants[0];
          const instance = firstVariant.createInstance();

          // Создаем текстовую ноду с именем компонента, исключая первые два знака
          const cardItemHeader = figma.createText();
          let componentName = componentSet.name;
          // Если имя содержит символ '_', обрезаем его до этого символа.
          let trimmedName = componentName.split('_')[0];
          // Если длина обрезанного имени больше 2, удаляем начальные пробелы после первых двух символов
          // Если меньше или равно 2, удаляем начальные пробелы без проверки длины
          cardItemHeader.characters = trimmedName.length > 2 ? trimmedName.substring(2).replace(/^\s+/, '') : trimmedName.replace(/^\s+/, '');
          // Устанавливаем размер шрифта
          cardItemHeader.fontSize = 48;

          // Создаем второй текст с необходимыми параметрами
          const cardItemCaption = figma.createText();
          cardItemCaption.characters = "Storybook";
          cardItemCaption.fontSize = 24;
          cardItemCaption.lineHeight = { value: 32, unit: 'PIXELS' };
          cardItemCaption.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
          cardItemCaption.opacity = 0.6;

          // Устанавливаем гиперссылку на мастер-компонент
          cardItemHeader.hyperlink = {
            type: "NODE",
            value: componentSet.id
          };

          // Создаем основной фрейм для инстанса
          const cardItem = figma.createFrame();         

          // Устанавливаем фиксированные размеры фрейма
          cardItem.resize(frameWidth, 540);
          cardItem.cornerRadius = 32;
          cardItem.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          cardItem.clipsContent = true;

          // Добавляем текст и инстанс непосредственно в основной фрейм
          cardItemHeader.x = paddingSide;
          cardItemHeader.y = paddingTop;
          cardItemCaption.x = paddingSide;
          cardItemCaption.y = cardItemHeader.y + cardItemHeader.height + 16;
          instance.x = paddingSide;
          instance.y = cardItemCaption.y + cardItemCaption.height + 32; // Отступ между текстом и инстансом

          cardItem.appendChild(cardItemHeader);
          cardItem.appendChild(cardItemCaption);
          cardItem.appendChild(instance);

          // Добавляем основной фрейм в список карточек
          cardList.appendChild(cardItem);  
        }
      }

      // Добавляем контейнер с карточками на страницу
      pageContainer.appendChild(cardList);
      // Позиционируем контейнер страницы и добавляем его на новую страницу
      pageContainer.x = 0;
      pageContainer.y = containerY;
      newPage.appendChild(pageContainer);

      // Обновляем позицию Y для следующего контейнера
      containerY += pageContainer.height + pageSpacing;
    }
  }

  // Переключаемся на новую страницу
  await figma.setCurrentPageAsync(newPage);

  // Закрываем плагин после выполнения
  figma.closePlugin();
}

// Запускаем основную функцию
main();

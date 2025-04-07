async function main() {
  // Загружаем все страницы, чтобы иметь возможность их обработать
  await figma.loadAllPagesAsync();

  // Предварительно загружаем шрифт "Inter Regular"
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Создаем новую страницу
  const newPage = figma.createPage();
  newPage.name = "Collected Components";

  // Переменные для отслеживания позиции фрейма на новой странице
  let currentX = 0;
  const startY = -200;
  const frameSpacing = 80;
  const frameWidth = 540;

  // Проходим по всем существующим страницам
  for (const page of figma.root.children) {
    if (page.type !== "PAGE") continue;

    // Получаем все компонент-сеты на текущей странице
    const componentSets = page.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];

    for (const componentSet of componentSets) {
      // Получаем все компоненты (варианты) в компонент-сете
      const variants = componentSet.children.filter(node => node.type === 'COMPONENT') as ComponentNode[];

      if (variants.length > 0) {
        // Создаем инстанс из первого компонента
        const firstVariant = variants[0];
        const instance = firstVariant.createInstance();

        // Применяем тень к инстансу
        instance.effects = [
          { type: 'DROP_SHADOW', visible: true, color: { r: 165/255, g: 177/255, b: 202/255, a: 0.30 }, offset: { x: 0, y: 0 }, radius: 3, spread: 0, blendMode: "NORMAL" },
          { type: 'DROP_SHADOW', visible: true, color: { r: 165/255, g: 177/255, b: 202/255, a: 0.30 }, offset: { x: 0, y: 10 }, radius: 40, spread: 0, blendMode: "NORMAL" }
        ];

        // Создаем текстовую ноду с именем компонента, исключая первые два знака
        const text = figma.createText();
        // Удаляем первые два символа и любые начальные пробелы
        text.characters = componentSet.name.length > 2 ? componentSet.name.substring(2).replace(/^\s+/, '') : componentSet.name.replace(/^\s+/, '');
        text.fontSize = 48;

        // Создаем второй текст с необходимыми параметрами
        const secondaryText = figma.createText();
        secondaryText.characters = "Storybook";
        // Настраиваем свойства текста
        secondaryText.fontSize = 24;
        secondaryText.lineHeight = { value: 32, unit: 'PIXELS' };
        secondaryText.fills = [{ type: "SOLID", color: { r: 0.1, g: 0.168, b: 0.302 } }];
        secondaryText.opacity = 0.6; // Устанавливаем прозрачность текста
        


        // Устанавливаем гиперссылку на мастер-компонент
        text.hyperlink = {
          type: "NODE",
          value: componentSet.id
        };

        // Создаем фреймы-контейнеры для текста и инстанса
        const textContainer = figma.createFrame();
        const instanceContainer = figma.createFrame();

        // Устанавливаем, что контейнеры не имеют заливки
        textContainer.fills = [];
        instanceContainer.fills = [];

        // Устанавливаем, что контейнеры не обрезают контент
        textContainer.clipsContent = false;
        instanceContainer.clipsContent = false;

        // Добавляем текст и инстанс в контейнеры
        textContainer.appendChild(text);
        textContainer.appendChild(secondaryText);
        instanceContainer.appendChild(instance);

        // Создаем основной фрейм для организации
        const frame = figma.createFrame();

        // Устанавливаем фиксированные размеры фрейма
        frame.resize(frameWidth, 540);
        frame.cornerRadius = 32;
        frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        frame.clipsContent = true;

        // Позиционируем текст и инстанс внутри их контейнеров
        const paddingTop = 48;
        const paddingSide = 48;
        
        text.x = 0;
        text.y = 0;
        secondaryText.x = 0;
        secondaryText.y = text.height + 16;
        instance.x = 0;
        instance.y = 0;

        textContainer.x = paddingSide;
        textContainer.y = paddingTop;
        instanceContainer.x = paddingSide;
        instanceContainer.y = textContainer.y + text.height + 88; // 10 пикселей между текстом и инстансом

        // Добавляем контейнеры в основной фрейм
        frame.appendChild(textContainer);
        frame.appendChild(instanceContainer);

        // Позиционируем основной фрейм и добавляем его на новую страницу
        frame.x = currentX;
        frame.y = startY;
        newPage.appendChild(frame);

        // Обновляем позицию X для следующего фрейма
        currentX += frameWidth + frameSpacing;
      }
    }
  }

  // Переключаемся на новую страницу
  await figma.setCurrentPageAsync(newPage);

  // Закрываем плагин после выполнения
  figma.closePlugin();
}

// Запускаем основную функцию
main();
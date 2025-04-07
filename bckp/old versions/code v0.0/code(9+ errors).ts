async function main() {
  // Предварительно загружаем шрифт "Inter Regular"
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });

  // Получаем все узлы типа COMPONENT_SET на текущей странице
  const componentSets = figma.currentPage.findAll(node => node.type === 'COMPONENT_SET') as ComponentSetNode[];

  // Начальная X и Y координаты для первого фрейма
  let currentX = 0;
  const startY = -200;

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

      // Создаем текстовую ноду с именем компонента и ID
      const text = figma.createText();
      text.characters = ${componentSet.name} (ID: ${componentSet.id}); // Обратите внимание на использование обратных кавычек

      text.fontSize = 48;

      // Ассоциируем текстовую ноду с ID компонента
      text.setPluginData('componentId', componentSet.id);

      // Создаем фреймы-контейнеры для текста и инстанса
      const textContainer = figma.createFrame();
      const instanceContainer = figma.createFrame();

      // Устанавливаем, что контейнеры не имеют заливки
      textContainer.fills = [];
      instanceContainer.fills = [];

      // Устанавливаем, что контейнеры не обрезают контент
      textContainer.clipsContent = false;
      instanceContainer.clipsContent = false;

      // Создаем основной фрейм для организации
      const frame = figma.createFrame();
      const frameWidth = 540; // Ширина фрейма
      const frameHeight = 540; // Высота фрейма
      const paddingTop = 48;
      const paddingSide = 48;
      const availableHeight = frameHeight - paddingTop * 2;

      // Устанавливаем, что текстовый и инстанс-контейнеры занимают половину доступной высоты
      textContainer.resize(frameWidth - paddingSide * 2, availableHeight / 2);
      instanceContainer.resize(frameWidth - paddingSide * 2, availableHeight / 2);

      // Добавляем текст и инстанс в контейнеры
      textContainer.appendChild(text);
      instanceContainer.appendChild(instance);

      // Позиционируем текст и инстанс внутри их контейнеров
      text.x = 0;
      text.y = 0;
      instance.x = 0;
      instance.y = 0;

      // Устанавливаем фиксированные размеры фрейма
      frame.resize(frameWidth, frameHeight);
      frame.cornerRadius = 32;
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
      frame.clipsContent = true;

      // Позиционируем контейнеры внутри основного фрейма
      textContainer.x = paddingSide;
      textContainer.y = paddingTop;
      instanceContainer.x = paddingSide;
      instanceContainer.y = textContainer.y + textContainer.height;

      // Добавляем контейнеры в основной фрейм
      frame.appendChild(textContainer);
      frame.appendChild(instanceContainer);

      // Позиционируем основной фрейм по X и Y координатам
      frame.x = currentX;
      frame.y = startY;
      currentX = frame.x + frame.width + 80;

      // Добавляем


фрейм на страницу
      figma.currentPage.appendChild(frame);
    }
  }

  // Закрываем плагин после выполнения
  figma.closePlugin();
}

// Запускаем основную функцию
main();
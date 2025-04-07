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

      // Создаем текстовую ноду с именем компонента и сохраняем ID в имя
      const text = figma.createText();
      text.characters = `${componentSet.name} (ID: ${componentSet.id})`; // Включаем ID для наглядности
      text.fontSize = 15;

      // Ассоциируем текстовую ноду с ID компонента, который она описывает
      text.setPluginData('componentId', componentSet.id);

      // Создаем фрейм для инстанса
      const frame = figma.createFrame();

      // Устанавливаем размеры и отступы
      frame.resize(200, 160);
      frame.paddingLeft = 24;
      frame.paddingRight = 24;
      frame.paddingTop = 24;
      frame.paddingBottom = 24;
      frame.cornerRadius = 14;
      frame.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

      // Устанавливаем Auto Layout
      frame.layoutMode = 'VERTICAL'; // flex-direction: column
      frame.primaryAxisAlignItems = 'MAX'; // justify-content: flex-end
      frame.counterAxisAlignItems = 'MIN'; // align-items: flex-start
      frame.itemSpacing = 8; // gap

      // Позиционируем фрейм по X и Y координатам
      frame.x = currentX;
      frame.y = startY;
      currentX = frame.x + frame.width + 80;

      // Добавляем элементы в фрейм
      frame.appendChild(text);
      frame.appendChild(instance);

      // Добавляем фрейм на страницу
      figma.currentPage.appendChild(frame);
    }
  }

  // Закрываем плагин после выполнения
  figma.closePlugin();
}

// Запускаем основную функцию
main();
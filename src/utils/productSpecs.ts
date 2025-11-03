export const getProductSpecs = (productId: number, productName: string, category: string): string[] => {
  if (category === 'Процессоры') {
    if (productName.includes('Ryzen 9 7950X')) return ['16 ядер / 32 потока', '4.5-5.7 ГГц', 'TDP 170W', 'Socket AM5'];
    if (productName.includes('i9-13900K')) return ['24 ядра / 32 потока', '3.0-5.8 ГГц', 'TDP 125W', 'Socket LGA1700'];
    if (productName.includes('Ryzen 7 7700X')) return ['8 ядер / 16 потоков', '4.5-5.4 ГГц', 'TDP 105W', 'Socket AM5'];
    if (productName.includes('i7-13700K')) return ['16 ядер / 24 потока', '3.4-5.4 ГГц', 'TDP 125W', 'Socket LGA1700'];
    return ['8 ядер', 'До 5.0 ГГц', 'TDP 105W'];
  }
  
  if (category === 'Видеокарты') {
    if (productName.includes('RTX 4090')) return ['24 GB GDDR6X', '2520 МГц', '450W TDP', 'DLSS 3.0'];
    if (productName.includes('RX 7900 XTX')) return ['24 GB GDDR6', '2500 МГц', '355W TDP', 'FSR 3.0'];
    if (productName.includes('RTX 4080')) return ['16 GB GDDR6X', '2505 МГц', '320W TDP', 'DLSS 3.0'];
    if (productName.includes('RX 7900 XT')) return ['20 GB GDDR6', '2400 МГц', '300W TDP', 'FSR 3.0'];
    return ['GDDR6', 'Ray Tracing', '300W TDP'];
  }
  
  if (category === 'Материнские платы') {
    if (productName.includes('B650')) return ['Socket AM5', 'DDR5', 'PCIe 5.0', 'ATX'];
    if (productName.includes('B760') || productName.includes('Z790')) return ['Socket LGA1700', 'DDR5', 'PCIe 5.0', 'ATX'];
    if (productName.includes('X670')) return ['Socket AM5', 'DDR5', 'PCIe 5.0', 'ATX'];
    return ['DDR5', 'PCIe 4.0', 'ATX'];
  }
  
  if (category === 'Оперативная память') {
    if (productName.includes('DDR5')) {
      if (productName.includes('64GB')) return ['64 GB (2x32)', 'DDR5-6000', 'CL30', 'RGB'];
      if (productName.includes('32GB')) return ['32 GB (2x16)', 'DDR5-6000', 'CL36', 'RGB'];
      return ['16 GB', 'DDR5-5600', 'CL36'];
    }
    if (productName.includes('32GB')) return ['32 GB (2x16)', 'DDR4-3600', 'CL18', 'RGB'];
    return ['16 GB', 'DDR4-3200', 'CL16'];
  }
  
  if (category === 'Накопители SSD') {
    if (productName.includes('2TB')) return ['2000 GB', 'NVMe PCIe 4.0', '7000 МБ/с чтение', '5 лет гарантия'];
    if (productName.includes('1TB')) return ['1000 GB', 'NVMe PCIe 4.0', '7000 МБ/с чтение', '5 лет гарантия'];
    return ['500 GB', 'NVMe PCIe 3.0', '3500 МБ/с'];
  }
  
  if (category === 'Блоки питания') {
    if (productName.includes('1200W')) return ['1200 Вт', '80+ Platinum', 'Модульный', 'RGB'];
    if (productName.includes('850W') || productName.includes('850')) return ['850 Вт', '80+ Gold', 'Модульный', 'Бесшумный'];
    if (productName.includes('750W') || productName.includes('750')) return ['750 Вт', '80+ Gold', 'Модульный', 'Бесшумный'];
    return ['650 Вт', '80+ Bronze', 'Полумодульный'];
  }
  
  if (category === 'Мониторы') {
    if (productName.includes('4K') || productName.includes('UHD')) return ['27"', '3840x2160', '144 Гц', 'IPS'];
    if (productName.includes('QHD')) return ['27"', '2560x1440', '165 Гц', 'IPS'];
    return ['24"', '1920x1080', '144 Гц', 'IPS'];
  }
  
  return ['Премиум качество', 'Гарантия 1 год', 'В наличии'];
};

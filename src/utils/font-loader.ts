// 简单的字体加载器 - 避免timeout错误
export const loadFontSafely = async () => {
  try {
    const font = new FontFace(
      'Cubano',
      "url('/fonts/Cubano.woff') format('woff')"
    );
    
    // 设置较短的超时时间
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('字体加载超时')), 5000)
    );
    
    const fontPromise = font.load().then(() => {
      document.fonts.add(font);
      return font;
    });
    
    // 竞争超时和字体加载
    await Promise.race([fontPromise, timeoutPromise]);
    
    console.log('字体加载成功');
    return true;
  } catch (error) {
    console.warn('字体加载失败，使用备用字体:', error);
    // 即使字体加载失败，也继续执行
    return false;
  }
};
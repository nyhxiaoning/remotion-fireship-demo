import { continueRender, delayRender, staticFile } from "remotion";

if (typeof window !== "undefined" && "FontFace" in window) {
  const font = new FontFace(
    "Cubano",
    "url(" + staticFile("/fonts/Cubano.woff") + ") format('woff')"
  );
  const handle = delayRender();
  
  // 设置字体加载超时 - 5秒
  const fontTimeout = setTimeout(() => {
    console.warn('字体加载超时，继续渲染');
    continueRender(handle);
  }, 5000);
  
  font.load().then(() => {
    clearTimeout(fontTimeout);
    document.fonts.add(font);
    continueRender(handle);
    console.log('字体加载成功');
  }).catch((error) => {
    clearTimeout(fontTimeout);
    console.warn('字体加载失败:', error);
    continueRender(handle); // 即使失败也继续渲染
  });
}

export const getFont = () => null;

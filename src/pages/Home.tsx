import React from "react";
import { useNavigate } from "react-router-dom";
import { Upload, Sparkles, Music, Download } from "lucide-react";
import { useWeddingStore } from "../store/weddingStore";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { project } = useWeddingStore();

  const handleUploadClick = () => {
    navigate("/editor");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-600 via-red-700 to-yellow-600">
      {/* 头部 */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative z-10 container mx-auto px-6 py-16 text-center">
          <h1 className="text-6xl font-bold text-yellow-300 mb-4">
            中式婚礼视频生成器
          </h1>
          <p className="text-xl text-yellow-100 mb-8">
            用AI技术打造专属的中式婚礼祝福视频
          </p>
          <div className="flex justify-center space-x-4">
            <button
              onClick={handleUploadClick}
              className="bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              开始制作
            </button>
            <button className="border-2 border-yellow-300 text-yellow-300 hover:bg-yellow-300 hover:text-red-800 font-bold py-4 px-8 rounded-full transition-all duration-300">
              查看模板
            </button>
          </div>
        </div>
      </header>

      {/* 特性展示 */}
      <section className="py-20 bg-gradient-to-r from-red-800 to-red-600">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">
            为什么选择我们
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8 bg-red-700 bg-opacity-50 rounded-lg backdrop-blur-sm">
              <Upload className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                简单易用
              </h3>
              <p className="text-yellow-100">
                拖拽上传照片，自动生成专业级婚礼视频
              </p>
            </div>
            <div className="text-center p-8 bg-red-700 bg-opacity-50 rounded-lg backdrop-blur-sm">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                中式风格
              </h3>
              <p className="text-yellow-100">
                红金配色，传统元素，展现东方美学
              </p>
            </div>
            <div className="text-center p-8 bg-red-700 bg-opacity-50 rounded-lg backdrop-blur-sm">
              <Download className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-yellow-300 mb-4">
                高清输出
              </h3>
              <p className="text-yellow-100">1080P高清视频，支持多平台分享</p>
            </div>
          </div>
        </div>
      </section>

      {/* 模板预览 */}
      <section className="py-20 bg-gradient-to-br from-yellow-600 to-red-600">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center text-yellow-300 mb-16">
            精美模板
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-red-800 bg-opacity-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-red-600 to-yellow-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  传统中式
                </h3>
                <p className="text-yellow-100 mb-4">
                  红金配色，经典中式婚礼风格
                </p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-2 px-4 rounded transition-colors duration-300">
                  使用模板
                </button>
              </div>
            </div>
            <div className="bg-red-800 bg-opacity-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-yellow-500 to-red-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  现代简约
                </h3>
                <p className="text-yellow-100 mb-4">简洁大方，现代中式美学</p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-2 px-4 rounded transition-colors duration-300">
                  使用模板
                </button>
              </div>
            </div>
            <div className="bg-red-800 bg-opacity-80 rounded-lg overflow-hidden shadow-2xl transform hover:scale-105 transition-all duration-300">
              <div className="h-48 bg-gradient-to-br from-red-700 to-yellow-600"></div>
              <div className="p-6">
                <h3 className="text-xl font-bold text-yellow-300 mb-2">
                  古典雅致
                </h3>
                <p className="text-yellow-100 mb-4">古典韵味，文人雅士风格</p>
                <button className="w-full bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-2 px-4 rounded transition-colors duration-300">
                  使用模板
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 底部 */}
      <footer className="bg-red-900 py-12">
        <div className="container mx-auto px-6 text-center">
          <p className="text-yellow-300 mb-4">© 2024 中式婚礼视频生成器</p>
          <p className="text-yellow-100">让每一个爱情故事都有完美的呈现</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;

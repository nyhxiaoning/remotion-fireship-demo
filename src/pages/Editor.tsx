import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Upload, Image, Music, Type, Play, ArrowRight, Plus, Settings } from 'lucide-react';
import { useWeddingStore } from '../store/weddingStore';
import { WeddingPhoto } from '../types';

const Editor: React.FC = () => {
  const navigate = useNavigate();
  const { project, addPhoto, removePhoto, setTexts, setMusic } = useWeddingStore();

  const handlePhotoUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const photo: WeddingPhoto = {
          id: Date.now().toString() + Math.random().toString(36).slice(2, 10),
          url: e.target?.result as string,
          name: file.name,
          size: file.size,
          uploadTime: Date.now()
        };
        addPhoto(photo);
      };
      reader.readAsDataURL(file);
    });
  }, [addPhoto]);

  const handleTextChange = useCallback((field: string, value: string) => {
    setTexts({ ...project.texts, [field]: value });
  }, [project.texts, setTexts]);

  const handlePreview = () => {
    navigate('/preview');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-red-800 mb-2">编辑婚礼视频</h1>
            <p className="text-red-600">上传照片，编辑文案，制作专属的中式婚礼视频</p>
          </div>
          <button
            onClick={() => navigate('/create-template')}
            className="flex items-center space-x-2 bg-yellow-500 hover:bg-yellow-400 text-red-800 px-4 py-2 rounded-lg font-medium"
          >
            <Settings className="w-4 h-4" />
            <span>自定义模板</span>
          </button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Image className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-red-800">照片管理</h2>
              </div>
              <div className="border-2 border-dashed border-red-300 rounded-lg p-8 text-center mb-6 hover:border-red-400 transition-colors">
                <Upload className="w-12 h-12 text-red-400 mx-auto mb-4" />
                <p className="text-red-600 mb-2">上传婚礼照片</p>
                <p className="text-red-400 text-sm mb-4">支持 JPG、PNG 格式，建议 4-8 张照片</p>
                <input type="file" multiple accept="image/*" onChange={handlePhotoUpload} className="hidden" id="photo-upload" />
                <label htmlFor="photo-upload" className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg cursor-pointer transition-colors">选择照片</label>
              </div>
              {project.photos.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {project.photos.map((photo) => (
                    <div key={photo.id} className="relative group">
                      <img src={photo.url} alt={photo.name} className="w-full h-32 object-cover rounded-lg border-2 border-red-200" />
                      <button onClick={() => removePhoto(photo.id)} className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Music className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-red-800">背景音乐</h2>
              </div>
              <div className="space-y-3">
                <label className="flex items-center p-3 border rounded-lg hover:bg-red-50 cursor-pointer">
                  <input type="radio" name="music" className="mr-3" defaultChecked />
                  <div>
                    <p className="font-medium text-red-800">中式婚礼进行曲</p>
                    <p className="text-sm text-red-500">30秒</p>
                  </div>
                </label>
                <button onClick={() => setMusic({ id: 'wedding_traditional', name: '中式婚礼音乐', duration: 30, url: '/assets/music/traditional.mp3' })} className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">选择音乐</button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Type className="w-6 h-6 text-red-600 mr-2" />
                <h2 className="text-2xl font-bold text-red-800">文案编辑</h2>
                <div className="ml-auto text-sm text-red-600 bg-red-50 px-3 py-1 rounded">
                  时长: {project.duration}秒
                </div>
              </div>
              <div className="space-y-4">
                {project.template.textFields.map((field) => (
                  <div key={field}>
                    <label className="block text-red-700 mb-2">{field}</label>
                    <input
                      value={project.texts[field] || ''}
                      onChange={(e) => handleTextChange(field, e.target.value)}
                      className="w-full border rounded-lg p-2"
                      placeholder={`请输入${field}文案`}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <Play className="w-6 h-6 text-red-600 mr-2" />
                  <h2 className="text-2xl font-bold text-red-800">预览</h2>
                </div>
                <button onClick={handlePreview} className="flex items-center bg-yellow-500 hover:bg-yellow-400 text-red-800 font-bold py-2 px-4 rounded">预览视频<ArrowRight className="w-4 h-4 ml-2" /></button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Editor;
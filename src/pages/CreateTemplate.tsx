import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Minus, Palette, Clock } from 'lucide-react';
import { useWeddingStore } from '@/store/weddingStore';
import type { WeddingTemplate } from '@/types';

const CreateTemplate: React.FC = () => {
  const navigate = useNavigate();
  const { setTemplate } = useWeddingStore();
  const [templateName, setTemplateName] = useState('');
  const [duration, setDuration] = useState(30);
  const [textFields, setTextFields] = useState(['开场', '相识', '相爱', '祝福']);
  const [primaryColor, setPrimaryColor] = useState('#DC143C');
  const [secondaryColor, setSecondaryColor] = useState('#FFD700');

  const addTextField = () => {
    setTextFields([...textFields, `文案${textFields.length + 1}`]);
  };

  const removeTextField = (index: number) => {
    if (textFields.length > 1) {
      setTextFields(textFields.filter((_, i) => i !== index));
    }
  };

  const updateTextField = (index: number, value: string) => {
    const newFields = [...textFields];
    newFields[index] = value;
    setTextFields(newFields);
  };

  const handleCreate = () => {
    if (!templateName.trim()) return;
    
    const newTemplate: WeddingTemplate = {
      id: `custom_${Date.now()}`,
      name: templateName,
      preview: '/assets/previews/custom.jpg',
      colors: { primary: primaryColor, secondary: secondaryColor },
      duration,
      textFields
    };
    
    setTemplate(newTemplate);
    navigate('/editor');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-yellow-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-3xl font-bold text-red-800">创建自定义模板</h1>
              <button onClick={() => navigate('/editor')} className="px-4 py-2 border border-red-600 text-red-800 rounded hover:bg-red-50">返回</button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-red-700 font-medium mb-2">模板名称</label>
                <input
                  type="text"
                  value={templateName}
                  onChange={(e) => setTemplateName(e.target.value)}
                  className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="输入模板名称"
                />
              </div>

              <div>
                <label className="block text-red-700 font-medium mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  视频时长（秒）
                </label>
                <input
                  type="range"
                  min="10"
                  max="120"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-center text-red-600 mt-2">{duration} 秒</div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-red-700 font-medium mb-2 flex items-center">
                    <Palette className="w-4 h-4 mr-2" />
                    主色调
                  </label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-12 h-12 rounded border" />
                    <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 border rounded p-2 text-sm" />
                  </div>
                </div>
                <div>
                  <label className="block text-red-700 font-medium mb-2">辅助色调</label>
                  <div className="flex items-center space-x-2">
                    <input type="color" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="w-12 h-12 rounded border" />
                    <input type="text" value={secondaryColor} onChange={(e) => setSecondaryColor(e.target.value)} className="flex-1 border rounded p-2 text-sm" />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-red-700 font-medium mb-2">文案段落</label>
                <div className="space-y-2">
                  {textFields.map((field, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <input
                        type="text"
                        value={field}
                        onChange={(e) => updateTextField(index, e.target.value)}
                        className="flex-1 border rounded-lg p-2"
                        placeholder={`文案 ${index + 1}`}
                      />
                      <button
                        onClick={() => removeTextField(index)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded"
                        disabled={textFields.length <= 1}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addTextField}
                    className="flex items-center space-x-2 px-3 py-2 border border-dashed border-red-300 rounded-lg text-red-600 hover:bg-red-50"
                  >
                    <Plus className="w-4 h-4" />
                    <span>添加文案段落</span>
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={handleCreate}
                  disabled={!templateName.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white font-bold py-3 px-6 rounded-lg transition-colors"
                >
                  创建模板
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTemplate;
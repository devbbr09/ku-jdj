// components/BasicInfoSelector.tsx

import React, { useState } from 'react';

export interface BasicInfo {
  faceShape: string;
  personalColor: string;
  eyeShape: string;
  eyeSize: string;
  eyeDirection: string;
  eyeDepth: string;
  preferredStyle: string[];
}

interface BasicInfoSelectorProps {
  onConfirm: (info: BasicInfo) => void;
  onCancel: () => void;
}

const faceShapeOptions = ['둥근형', '긴 얼굴형', '각진형(사각형)', '계란형', '하트형'];
const personalColorOptions = ['봄 웜', '여름 쿨', '가을 웜', '겨울 쿨'];
const eyeShapeOptions = ['무쌍', '속쌍', '겉쌍'];
const eyeSizeOptions = ['크다', '작다', '보통'];
const eyeDirectionOptions = ['올라감', '내려감', '중립'];
const eyeDepthOptions = ['돌출', '들어감', '보통'];
const preferredStyleOptions = ['데일리', '화사한', '시크한', '청순한', '섹시한', '트렌디한'];

const BasicInfoSelector: React.FC<BasicInfoSelectorProps> = ({ onConfirm, onCancel }) => {
  const [info, setInfo] = useState<BasicInfo>({
    faceShape: '',
    personalColor: '',
    eyeShape: '',
    eyeSize: '',
    eyeDirection: '',
    eyeDepth: '',
    preferredStyle: [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleStyleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    setInfo(prev => ({
      ...prev,
      preferredStyle: checked
        ? [...prev.preferredStyle, value]
        : prev.preferredStyle.filter(style => style !== value),
    }));
  };

  const isFormValid =
    info.faceShape &&
    info.personalColor &&
    info.eyeShape &&
    info.eyeSize &&
    info.eyeDirection &&
    info.eyeDepth;

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-h-[80vh] overflow-y-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">기본 정보 입력</h2>
      <p className="text-gray-600 mb-6 text-center">정확한 메이크업 진단을 위해 아래 정보를 선택해주세요.</p>

      <div className="space-y-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">얼굴형</label>
          <select
            name="faceShape"
            value={info.faceShape}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">선택</option>
            {faceShapeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">퍼스널 컬러</label>
          <select
            name="personalColor"
            value={info.personalColor}
            onChange={handleChange}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">선택</option>
            {personalColorOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>

        {/* 눈 정보 */}
        <h3 className="text-lg font-bold pt-4">눈 특징</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">눈꺼풀</label>
            <select name="eyeShape" value={info.eyeShape} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">선택</option>
              {eyeShapeOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">눈 크기</label>
            <select name="eyeSize" value={info.eyeSize} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">선택</option>
              {eyeSizeOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">눈매 방향</label>
            <select name="eyeDirection" value={info.eyeDirection} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">선택</option>
              {eyeDirectionOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-1">눈 입체감</label>
            <select name="eyeDepth" value={info.eyeDepth} onChange={handleChange} className="w-full p-2 border border-gray-300 rounded-md">
              <option value="">선택</option>
              {eyeDepthOptions.map(option => <option key={option} value={option}>{option}</option>)}
            </select>
          </div>
        </div>

        {/* 선호 스타일 */}
        <h3 className="text-lg font-bold pt-4">선호하는 화장 스타일</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {preferredStyleOptions.map(option => (
            <label key={option} className="flex items-center space-x-2">
              <input
                type="checkbox"
                value={option}
                checked={info.preferredStyle.includes(option)}
                onChange={handleStyleChange}
                className="form-checkbox text-primary rounded"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4 mt-8">
        <button
          onClick={() => onConfirm(info)}
          disabled={!isFormValid}
          className="bg-primary text-white font-bold py-2 px-4 rounded-md disabled:bg-gray-400"
        >
          확인
        </button>
        <button
          onClick={onCancel}
          className="bg-gray-200 text-gray-800 font-bold py-2 px-4 rounded-md"
        >
          취소
        </button>
      </div>
    </div>
  );
};

export default BasicInfoSelector;
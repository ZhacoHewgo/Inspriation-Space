import { Platform } from 'react-native';

export interface ImageUploadResult {
  success: boolean;
  uri?: string;
  error?: string;
}

// Web端图片上传工具
export const WebImageUpload = {
  // 选择并上传图片
  pickImage: (): Promise<ImageUploadResult> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve({ success: false, error: 'Not supported on this platform' });
        return;
      }

      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) {
          resolve({ success: false, error: 'No file selected' });
          return;
        }

        // 检查文件大小 (限制为5MB)
        if (file.size > 5 * 1024 * 1024) {
          resolve({ success: false, error: 'File size too large (max 5MB)' });
          return;
        }

        // 检查文件类型
        if (!file.type.startsWith('image/')) {
          resolve({ success: false, error: 'Please select an image file' });
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          if (result) {
            resolve({ success: true, uri: result });
          } else {
            resolve({ success: false, error: 'Failed to read file' });
          }
        };
        
        reader.onerror = () => {
          resolve({ success: false, error: 'Failed to read file' });
        };
        
        reader.readAsDataURL(file);
      };

      input.oncancel = () => {
        resolve({ success: false, error: 'User cancelled' });
      };

      input.click();
    });
  },

  // 从相机拍照 (Web端使用getUserMedia)
  takePhoto: (): Promise<ImageUploadResult> => {
    return new Promise((resolve) => {
      if (Platform.OS !== 'web') {
        resolve({ success: false, error: 'Not supported on this platform' });
        return;
      }

      // 检查是否支持getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        resolve({ success: false, error: 'Camera not supported in this browser' });
        return;
      }

      // 创建相机界面
      const modal = document.createElement('div');
      modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 10000;
      `;

      const video = document.createElement('video');
      video.style.cssText = `
        width: 80%;
        max-width: 500px;
        height: auto;
        border-radius: 8px;
      `;
      video.autoplay = true;

      const buttonContainer = document.createElement('div');
      buttonContainer.style.cssText = `
        margin-top: 20px;
        display: flex;
        gap: 10px;
      `;

      const captureBtn = document.createElement('button');
      captureBtn.textContent = '拍照';
      captureBtn.style.cssText = `
        padding: 10px 20px;
        background: #13a4ec;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;

      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = '取消';
      cancelBtn.style.cssText = `
        padding: 10px 20px;
        background: #6b7280;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
      `;

      buttonContainer.appendChild(captureBtn);
      buttonContainer.appendChild(cancelBtn);
      modal.appendChild(video);
      modal.appendChild(buttonContainer);
      document.body.appendChild(modal);

      let stream: MediaStream | null = null;

      const cleanup = () => {
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
        }
        document.body.removeChild(modal);
      };

      // 启动相机
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((mediaStream) => {
          stream = mediaStream;
          video.srcObject = mediaStream;
        })
        .catch(() => {
          cleanup();
          resolve({ success: false, error: 'Failed to access camera' });
        });

      // 拍照按钮
      captureBtn.onclick = () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(video, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg', 0.8);
          cleanup();
          resolve({ success: true, uri: dataURL });
        } else {
          cleanup();
          resolve({ success: false, error: 'Failed to capture image' });
        }
      };

      // 取消按钮
      cancelBtn.onclick = () => {
        cleanup();
        resolve({ success: false, error: 'User cancelled' });
      };
    });
  },
};
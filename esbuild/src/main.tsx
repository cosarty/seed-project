import { createRoot } from 'react-dom/client';
import React, { FC } from 'react';
import test1 from '@/mock/test1.json';
import test2 from '@/mock/test2.txt';
import './index.css';
import PageA from '@/pages/pageA';
import PageB from '@/pages/pageB';
import PageC from '@/pages/pageC';

const App: FC = () => {
  console.log(test1, 'test1.json');
  console.log(test2, 'test2.txt');
  return (
    <div>
      <p onClick={() => import('./pages/pageA/index').then(console.log)}>
        测试动态导入
      </p>
      <div>
        测试图标 <span className='iconfont icon-send'></span>
      </div>
      <p>main.js入口文件：</p>
      <PageA />
      <PageB />
      <PageC />
    </div>
  );
};

const root = createRoot(document.getElementById('root') as HTMLElement);
root.render(<App />);
